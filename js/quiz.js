export const ANSWERS=['B','C'];
export function scoreQuiz(values){if(!Array.isArray(values)||values.length!==2||values.some(v=>!['A','B','C','D'].includes(v)))throw new Error('請先完成兩道挑戰題。');return values.reduce((s,v,i)=>s+(v===ANSWERS[i]?50:0),0);}
export function feedback(score){return score===100?'太棒了！你認識大萍的漂浮方式，也知道葉片藏著空氣的祕密。':score===50?'很好的開始！再看看葉片的含氣構造，以及根有沒有固定在水底。':'謝謝你的努力！回到模型，點選三個標記，再和同學說說你的發現。';}
