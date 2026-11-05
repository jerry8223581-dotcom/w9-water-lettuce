"""blender --background --python tools/blender_water_lettuce.py -- output.glb"""
import bpy,sys,pathlib,importlib.util
folder=pathlib.Path(__file__).resolve().parent;spec=importlib.util.spec_from_file_location('plant_geometry',folder/'generate_model.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
# 使用全新的場景；不會開啟或覆寫任何既有.blend檔。
bpy.ops.wm.read_factory_settings(use_empty=True)
materials=[]
for name,color in [('葉片',(.12,.31,.07,1)),('嫩葉',(.19,.40,.11,1)),('懸垂根',(.16,.25,.09,1))]:
    material=bpy.data.materials.new(name);material.diffuse_color=color;material.use_nodes=True;bsdf=material.node_tree.nodes.get('Principled BSDF');bsdf.inputs['Base Color'].default_value=color;bsdf.inputs['Roughness'].default_value=.9;materials.append(material)
for name,vertices,faces,index in module.geometry():
    # 共用幾何為Y向上；轉為Blender的Z向上，再由GLB匯出器轉回Y向上。
    mesh=bpy.data.meshes.new(name);mesh.from_pydata([(x,-z,y) for x,y,z in vertices],[],faces);mesh.update();obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj);obj.data.materials.append(materials[index])
    for poly in mesh.polygons:poly.use_smooth=True
args=sys.argv[sys.argv.index('--')+1:] if '--' in sys.argv else []
target=pathlib.Path(args[0]) if args else folder.parent/'assets'/'water_lettuce_blender.glb'
if target.exists():raise RuntimeError('輸出檔已存在，請指定新的檔名，避免覆寫。')
bpy.ops.export_scene.gltf(filepath=str(target),export_format='GLB',export_yup=True)
print('Blender GLB exported:',target)
