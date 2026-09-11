/* 核心：用户档案、个性化算法、标签体系、合规文案 */

/* ---------- 健康目标 ---------- */
const GOALS = [
  { id: 'maintain', name: '日常维持', ico: 'maintain', desc: '保持现在的体重和状态', adj: 0 },
  { id: 'lose', name: '减脂塑形', ico: 'lose', desc: '稳步减重、减少体脂', adj: -350 },
  { id: 'muscle', name: '增肌强身', ico: 'muscle', desc: '增加肌肉、提升力量', adj: 250 },
  { id: 'stomach', name: '养胃调理', ico: 'stomach', desc: '清淡好消化、少刺激', adj: -100 },
  { id: 'sugar', name: '控糖轻食', ico: 'sugar', desc: '低升糖、稳血糖', adj: -200 },
  { id: 'thyroid', name: '甲状腺术后日常管理', ico: 'thyroid', desc: '按处方服药、均衡饮食、按期复查', adj: 0 }
];

/* ---------- 忌口 ---------- */
const AVOIDS = [
  { id: 'spicy', name: '不吃辛辣', ico: '🌶️' },
  { id: 'seafood', name: '海鲜过敏', ico: '🦐' },
  { id: 'lactose', name: '乳糖不耐', ico: '🥛' },
  { id: 'soy', name: '不吃豆制品', ico: '🫘' },
  { id: 'vegetarian', name: '素食为主', ico: '🥬' },
  { id: 'pork', name: '不吃猪肉', ico: '🐷' }
];

/* ---------- 健康关注（决定养护模块显示什么） ---------- */
const FOCUS = [
  { id: 'neck', name: '颈椎 / 肩颈', ico: 'neck', desc: '久坐僵硬、头晕、富贵包' },
  { id: 'waist', name: '腰椎 / 腰背', ico: 'waist', desc: '久坐腰痛、腰肌劳损' },
  { id: 'leg', name: '腿部 / 静脉', ico: 'leg', desc: '腿胀、静脉曲张、久站' },
  { id: 'eye', name: '眼部疲劳', ico: 'eye', desc: '看屏幕多、眼干眼涩' },
  { id: 'hand', name: '手部 / 腕部', ico: 'hand', desc: '鼠标手、手部发麻' },
  { id: 'sleep', name: '睡眠 / 作息', ico: 'sleep', desc: '入睡难、熬夜、起夜' },
  { id: 'thyroid', name: '甲状腺术后', ico: 'thyroid', desc: '按处方服药、按期复查、均衡饮食' },
  { id: 'posture', name: '体态 / 驼背', ico: 'posture', desc: '圆肩、驼背、头前伸' }
];

/* ---------- 甲状腺术后：用药与营养记录（具体方案以处方为准） ---------- */
const MED = {
  // 默认每日时间表（用户可在「我的」里调整）
  default: { drugTime: '06:30', calciumTime: '12:30', calciumEnabled: false, lowIodine: false },
  steps: [
    { id: 'drug', name: '左甲状腺素钠（按处方）', ico: 'pill', time: 'drugTime', note: '按医生或药师要求固定时间、用清水服用；通常空腹服，早餐前 30~60 分钟。钙剂、铁剂与药间隔至少 4 小时。' },
    { id: 'calcium', name: '钙剂 / 维生素 D（仅医生已开具时）', ico: 'bone', time: 'calciumTime', note: '是否需要、服用剂量与疗程取决于血钙、甲状旁腺功能和医生处方；不要仅因做过甲状腺手术自行长期补充。' }
  ],
  // 食物 has 标签 → 与药物的冲突提醒（has 体系：dairy / soy / seafood / meat / pork）
  conflicts: {
    dairy: { label: '奶类 / 高钙食物', warn: '不要与左甲状腺素同时服用；请按医生要求保持固定间隔。钙补充剂需间隔至少 4 小时。' },
    soy: { label: '豆制品', warn: '不要与左甲状腺素同时服用；保持稳定的食用习惯，如复查指标波动请咨询医生或药师。' },
    lowIodine: { label: '当前低碘期', warn: '仅在医生为放射性碘检查或治疗明确要求低碘时，才需要限制海带、紫菜、虾皮等高碘食物。' },
    meat: { label: '红肉 / 铁', warn: '若同时补铁，铁剂与钙片、甲状腺药都要错开时间服用。' },
    pork: { label: '红肉 / 铁', warn: '若同时补铁，铁剂与钙片、甲状腺药都要错开时间服用。' }
  }
};

/* ---------- 动作真人示范图（替代漫画小人 SVG） ---------- */
/* 手机端使用压缩后的 WebP；原始 PNG 保留在项目中作为素材源。 */
const ACT_IMG = {
  hotpack: 'assets/img/ex/hotpack.webp', shoulderSqueeze: 'assets/img/ex/shoulderSqueeze.webp', chinTuck: 'assets/img/ex/chinTuck.webp',
  neckIsoF: 'assets/img/ex/neckIsoF.webp', neckIsoB: 'assets/img/ex/neckIsoB.webp', neckIsoS: 'assets/img/ex/neckIsoS.webp',
  chestStretch: 'assets/img/ex/chestStretch.webp', shoulderRoll: 'assets/img/ex/shoulderRoll.webp',
  anklePump: 'assets/img/ex/anklePump.webp', ankleCircle: 'assets/img/ex/ankleCircle.webp', kneeExtend: 'assets/img/ex/kneeExtend.webp',
  heelRaise: 'assets/img/ex/heelRaise.webp', bicycle: 'assets/img/ex/bicycle.webp', legsUpWall: 'assets/img/ex/legsUpWall.webp',
  legShake: 'assets/img/ex/legShake.webp', walk: 'assets/img/ex/walk.webp', breath: 'assets/img/ex/breath.webp',
  raiseArms: 'assets/img/ex/raiseArms.webp', oneArmUp: 'assets/img/ex/oneArmUp.webp', sitStand: 'assets/img/ex/sitStand.webp',
  balance: 'assets/img/ex/balance.webp', palmEyes: 'assets/img/ex/palmEyes.webp', march: 'assets/img/ex/march.webp',
  sideStretch: 'assets/img/ex/sideStretch.webp',
  catCow: 'assets/img/care/catCow.webp', bridge: 'assets/img/care/bridge.webp', eyeRelax: 'assets/img/care/eyeRelax.webp', handRelax: 'assets/img/care/handRelax.webp'
};

/* ---------- 默认档案 ---------- */
const PROFILE_DEFAULT = {
  name: '胜兰',
  sex: 'f', age: 58, height: 160, weight: 60, act: 1.2,
  goal: 'thyroid',
  avoids: [],
  focus: ['neck', 'leg', 'thyroid'],
  thyroidSurgery: '已切除（范围待确认）',
  vertigoHistory: true,
  chronicLegPain: true,
  exerciseApproved: false,
  movementLimits: '避免颈部快速转动、后仰和强力对抗；出现眩晕或腿痛明显加重时停止。',
  clinicianNote: '',
  elder: true,        // 长辈模式（大字体 + 高对比）
  waterGoal: 8
};

/* ---------- 活动系数 ---------- */
const ACTIVITY = [
  { id: 'sit', name: '久坐少动', v: 1.2 },
  { id: 'light', name: '日常轻度活动', v: 1.375 },
  { id: 'active', name: '经常走动 / 锻炼', v: 1.55 }
];

/* ---------- 营养目标计算（Mifflin-St Jeor） ---------- */
function calcTarget(p) {
  const w = +p.weight || 60, h = +p.height || 160, a = +p.age || 40;
  const bmr = p.sex === 'f' ? (10 * w + 6.25 * h - 5 * a - 161) : (10 * w + 6.25 * h - 5 * a + 5);
  const tdee = bmr * (+p.act || 1.2);
  const g = GOALS.find(x => x.id === p.goal) || GOALS[0];
  let kcal = Math.round((tdee + g.adj) / 50) * 50;
  kcal = Math.max(1200, Math.min(2600, kcal));

  let proteinPerKg = 1.0;
  if (p.goal === 'lose') proteinPerKg = 1.4;
  else if (p.goal === 'muscle') proteinPerKg = 1.5;
  /* 甲状腺术后本身不自动提高蛋白质目标；如有专门营养处方应另行配置。 */
  const protein = Math.round(w * proteinPerKg);
  const fat = Math.round(kcal * 0.27 / 9);
  const carb = Math.round((kcal - protein * 4 - fat * 9) / 4);

  return {
    kcal, protein, fat, carb,
    bmr: Math.round(bmr), tdee: Math.round(tdee),
    water: Math.round(Math.min(2200, w * 32)),
    fiber: p.goal === 'sugar' ? 30 : 25
  };
}

/* 三餐热量分配 */
function mealSplit(kcal) {
  return {
    breakfast: Math.round(kcal * 0.28 / 10) * 10,
    lunch: Math.round(kcal * 0.38 / 10) * 10,
    dinner: Math.round(kcal * 0.27 / 10) * 10,
    snack: Math.round(kcal * 0.07 / 10) * 10
  };
}

/* BMI */
function bmi(p) {
  const h = (+p.height || 160) / 100, w = +p.weight || 60;
  const v = +(w / (h * h)).toFixed(1);
  const label = v < 18.5 ? '偏瘦' : v < 24 ? '正常' : v < 28 ? '超重' : '肥胖';
  return { v, label };
}

/* ---------- 合规文案 ---------- */
const LEGAL = {
  disclaimer: '本应用用于记录处方执行和提供一般生活参考，不自动诊断疾病，也不替代医生、药师、康复师或血管外科的个体化建议。出现页面所列警示症状时，请停止活动并及时就医。',
  terms: `用户协议（简版）

一、服务说明
本应用为个人健康生活管理工具，提供饮食参考、居家锻炼与日常养护内容，不提供医疗服务、诊断、处方或治疗建议。

二、用户责任
1. 药物、补钙、低碘饮食和康复动作只按已确认的医生或康复师方案执行，不依据“做过手术”自行推断；
2. 若今天出现头晕、视物异常、走路不稳、肢体麻木，或单侧腿突然肿痛发热，请不要开始课程；
3. 若出现言语不清、单侧无力、呼吸困难、胸痛、咳血、晕厥或静脉出血不止，请立即呼叫 120。

三、内容与知识产权
应用内的图文内容由本团队整理编写；第三方视频通过原平台播放器嵌入或在原平台打开，版权归原作者所有。公开可访问不代表已获得商业使用授权，正式发布前需另行确认授权范围。

四、协议变更
我们可能随产品迭代更新本协议，继续使用即视为接受更新后的内容。`,
  privacy: `隐私政策（简版）

一、我们收集什么
您主动填写的身体数据（身高、体重、年龄等）、健康目标、忌口、健康关注、动作限制，以及您的每日状态、打卡和收藏记录。

二、数据存储位置
以上数据全部保存在您自己的手机浏览器本地（localStorage），不会上传至任何服务器，我们无法查看您的任何数据。

三、我们不做什么
应用本身不读取通讯录、位置或通话记录，不含自建统计与广告 SDK。健康档案不会由本应用主动上传；但加载嵌入视频时，浏览器会连接哔哩哔哩等第三方平台，对方可能获得 IP、设备信息和视频访问记录。

四、您的权利
您可在「我的」中导出 JSON 备份、导入暖年备份更新数据，或清空全部本地记录。备份文件由您自行保管，其中包含健康相关信息，请勿发送给无关人员。清除后如无备份将无法恢复。

五、关于视频
应用不会在进入页面时自动连接视频平台。只有展开烹饪做法或主动点击“加载跟练视频”后才加载第三方播放器；第三方如何处理信息受其隐私政策约束。`
};
