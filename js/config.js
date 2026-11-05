export const CONFIG = {
  modelPath:'./assets/water_lettuce.glb', cameraOrbit:'35deg 70deg 1.75m', cameraTarget:'0m -0.10m 0m',
  hotspots:[
    {id:'leaf',number:'1',title:'大萍的葉片',position:'0.28m 0.14m 0m',normal:'0 1 0',text:'大萍的葉片像花朵一樣，一片一片圍成一圈，叫做「蓮座狀排列」。葉片裡有能存放空氣的構造，叫做含氣組織，有助於漂浮在水面。'},
    {id:'root',number:'2',title:'大萍的根部',position:'0.02m -0.30m 0.03m',normal:'0 0 1',text:'大萍也有根喔！它的根垂在水中，沒有固定在池塘底部的泥土裡。轉到側面或下方，看看細細的根。'},
    {id:'growth',number:'3',title:'大萍的生長方式',position:'-0.20m 0.12m 0.15m',normal:'0 1 0',text:'大萍是「漂浮性水生植物」。整株漂浮在水面，可以隨著水流移動，不像浮葉性植物把根固定在水底。'}
  ],
  ar:{targetsConfigured:false,targetsPath:'./assets/targets.mind',targetIndex:0,scale:'0.8 0.8 0.8',position:'0 0 0',rotation:'90 0 0'},
  appsScriptEndpoint:'', publicSiteUrl:'https://jerry8223581-dotcom.github.io/w9-water-lettuce/', submissionTimeoutMs:20000
};
