"""標準Python可產生GLB；Blender腳本共用同一組幾何，無外部模型冒用。"""
import math,random,json,struct,pathlib
def geometry():
    parts=[];rng=random.Random(91)
    def tube(a,b,r,sides=7):
        d=[b[i]-a[i] for i in range(3)];length=math.sqrt(sum(x*x for x in d));d=[x/length for x in d]
        ref=(1,0,0) if abs(d[0])<.8 else (0,0,1)
        u=(d[1]*ref[2]-d[2]*ref[1],d[2]*ref[0]-d[0]*ref[2],d[0]*ref[1]-d[1]*ref[0]);norm=math.sqrt(sum(x*x for x in u));u=[x/norm for x in u];v=(d[1]*u[2]-d[2]*u[1],d[2]*u[0]-d[0]*u[2],d[0]*u[1]-d[1]*u[0])
        verts=[tuple(p[j]+radius*(u[j]*math.cos(i*2*math.pi/sides)+v[j]*math.sin(i*2*math.pi/sides)) for j in range(3)) for p,radius in [(a,r),(b,r*.65)] for i in range(sides)]
        faces=[]
        for i in range(sides):k=(i+1)%sides;faces.extend([(i,k,i+sides),(k,k+sides,i+sides)])
        return verts,faces
    for ring,(count,length,width,rise) in enumerate([(9,.43,.13,.10),(7,.30,.105,.18),(5,.18,.075,.22)]):
        for leaf in range(count):
            angle=2*math.pi*leaf/count+ring*.47;verts=[];faces=[];steps=18;across=12
            for i in range(steps+1):
                t=i/steps;spread=width*math.sin(math.pi*t)**.5
                for j in range(across+1):
                    s=2*j/across-1;r=.025+length*t;x=r*math.cos(angle)-s*spread*math.sin(angle);z=r*math.sin(angle)+s*spread*math.cos(angle)
                    y=.025+rise*(t**.8)+.024*math.sin(math.pi*t)*(1-s*s)+.007*math.sin(j*math.pi*1.6)*math.sin(math.pi*t)
                    verts.append((x,y,z))
            for i in range(steps):
                for j in range(across):k=i*(across+1)+j;faces.extend([(k,k+1,k+across+1),(k+1,k+across+2,k+across+1)])
            parts.append((f'rosette_leaf_{ring}_{leaf}',verts,faces,ring%2))
    for root in range(17):
        angle=rng.random()*2*math.pi;rad=rng.uniform(.01,.065);a=(rad*math.cos(angle),.025,rad*math.sin(angle));prev=a;length=rng.uniform(.34,.64)
        for segment in range(9):
            t=(segment+1)/9;b=(a[0]+.045*math.sin(t*5+root)*t,-length*t,a[2]+.05*math.sin(t*4+root)*t)
            verts,faces=tube(prev,b,.004*(1-t*.6));parts.append((f'root_{root}_{segment}',verts,faces,2))
            if segment>1:
                end=(b[0]+rng.uniform(-.065,.065),b[1]-.045,b[2]+rng.uniform(-.055,.055));v,f=tube(b,end,.0015);parts.append((f'root_branch_{root}_{segment}',v,f,2))
            prev=b
    return parts
def export_glb(destination):
    blob=bytearray();views=[];accessors=[];meshes=[];nodes=[]
    def accessor(data,kind,component,count,bounds=None):
        while len(blob)%4:blob.append(0)
        offset=len(blob);blob.extend(data);vi=len(views);views.append(dict(buffer=0,byteOffset=offset,byteLength=len(data)));a=dict(bufferView=vi,componentType=component,count=count,type=kind)
        if bounds:a.update(min=bounds[0],max=bounds[1])
        accessors.append(a);return len(accessors)-1
    for name,verts,faces,material in geometry():
        positions=accessor(struct.pack('<'+'f'*len(verts)*3,*[x for v in verts for x in v]),'VEC3',5126,len(verts),([min(v[i] for v in verts) for i in range(3)],[max(v[i] for v in verts) for i in range(3)]))
        normals=[[0.,0.,0.] for _ in verts]
        for a,b,c in faces:
            u=[verts[b][j]-verts[a][j] for j in range(3)];v=[verts[c][j]-verts[a][j] for j in range(3)];n=(u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0])
            for idx in (a,b,c):
                for j in range(3):normals[idx][j]+=n[j]
        normals=[tuple(x/(math.sqrt(sum(k*k for k in n)) or 1) for x in n) for n in normals]
        normal=accessor(struct.pack('<'+'f'*len(verts)*3,*[x for v in normals for x in v]),'VEC3',5126,len(verts))
        indices=accessor(struct.pack('<'+'H'*len(faces)*3,*[i for f in faces for i in f]),'SCALAR',5123,len(faces)*3)
        meshes.append(dict(name=name,primitives=[dict(attributes=dict(POSITION=positions,NORMAL=normal),indices=indices,material=material)]));nodes.append(dict(name=name,mesh=len(meshes)-1))
    materials=[dict(name=n,pbrMetallicRoughness=dict(baseColorFactor=color,metallicFactor=0,roughnessFactor=.9),doubleSided=True) for n,color in [('leaf_green',[.12,.31,.07,1]),('young_leaf',[.19,.40,.11,1]),('hanging_roots',[.16,.25,.09,1])]]
    gltf=dict(asset=dict(version='2.0',generator='water-lettuce-ar original educational schematic'),scene=0,scenes=[dict(nodes=list(range(len(nodes))))],nodes=nodes,meshes=meshes,materials=materials,buffers=[dict(byteLength=len(blob))],bufferViews=views,accessors=accessors)
    js=json.dumps(gltf,separators=(',',':')).encode();js+=b' '*((-len(js))%4);blob+=b'\0'*((-len(blob))%4)
    output=struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(blob))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(blob),0x004e4942)+blob
    pathlib.Path(destination).write_bytes(output);return len(output)
if __name__=='__main__':
    target=pathlib.Path(__file__).resolve().parents[1]/'assets'/'water_lettuce.glb';print('Exported procedural teaching GLB:',export_glb(target),'bytes')
