/* 身体养护：部位养护 / 作息养护 / 季节养护 / 舒缓课程 */

const CARE = {};

/* 补充动作图示 */
CARE.SVG = {};
CARE.SVG.catCow = `<svg viewBox="0 0 120 100">
<line x1="6" y1="86" x2="114" y2="86" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="26" cy="58" r="10" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M36 64 Q62 50 88 64" stroke="#5B7C99" stroke-width="13" stroke-linecap="round" fill="none" opacity=".9"/>
<path d="M38 70 L38 86 M84 70 L84 86" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M62 52 L62 86" stroke="#5B7C99" stroke-width="7" stroke-linecap="round" opacity=".45"/>
<path d="M40 52 Q62 38 86 52" stroke="#5F9377" stroke-width="2.4" fill="none" stroke-dasharray="4 3"/>
<path d="M18 48 l-4 -6 M104 48 l4 -6" stroke="#C58A2B" stroke-width="2.2" stroke-linecap="round"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">跪姿·吸气塌腰抬头 呼气弓背</text>
</svg>`;

CARE.SVG.bridge = `<svg viewBox="0 0 120 100">
<line x1="6" y1="84" x2="114" y2="84" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="20" cy="66" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M28 70 Q58 44 92 70" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" fill="none" opacity=".9"/>
<path d="M92 70 L98 84 M28 70 L26 84" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M62 50 L62 84" stroke="#5B7C99" stroke-width="6" stroke-linecap="round" opacity=".4"/>
<path d="M30 76 L22 84" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M56 40 q6 -8 12 -2" stroke="#5F9377" stroke-width="2.4" fill="none" marker-end="url(#cb1)"/>
<defs><marker id="cb1" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#5F9377"/></marker></defs>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">仰卧·臀部抬起 肩髋膝成一线</text>
</svg>`;

CARE.SVG.sideStretch = `<svg viewBox="0 0 120 100">
<line x1="6" y1="92" x2="114" y2="92" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="60" cy="16" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 27 L60 60" stroke="#5B7C99" stroke-width="13" stroke-linecap="round" opacity=".9"/>
<path d="M52 34 L44 8 L38 2" stroke="#FDEBDC" stroke-width="6.5" fill="none" stroke-linecap="round"/>
<path d="M68 34 L78 56 L74 68" stroke="#FDEBDC" stroke-width="6.5" fill="none" stroke-linecap="round"/>
<path d="M60 60 L52 92" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M60 60 L68 92" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M46 6 q-6 -4 -8 2" stroke="#5F9377" stroke-width="2.2" fill="none" stroke-dasharray="3 2.5"/>
<text x="60" y="99" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">手臂过头·身体向对侧弯</text>
</svg>`;

CARE.SVG.march = `<svg viewBox="0 0 120 100">
<line x1="6" y1="92" x2="114" y2="92" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="56" cy="16" r="10" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M58 26 C64 34 64 48 62 58" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M62 58 L52 74 L52 92" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M62 58 L74 68 L72 80" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M58 32 L42 44" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M58 32 L74 40" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M78 60 q8 4 4 12" stroke="#C58A2B" stroke-width="2.2" fill="none" marker-end="url(#cm1)"/>
<defs><marker id="cm1" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<text x="60" y="99" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">原地踏步·手臂自然摆动</text>
</svg>`;

CARE.SVG.eyeRelax = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="46" r="27" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<circle cx="60" cy="46" r="12" fill="#F5C9A8" stroke="#E07A5F" stroke-width="2"/>
<circle cx="60" cy="46" r="5" fill="#6B4A38"/>
<circle cx="56" cy="42" r="2" fill="#fff"/>
<path d="M22 52 q-9 6 -2 17 q5 9 16 6" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M98 52 q9 6 2 17 q-5 9 -16 6" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M60 12 v-8 M32 24 l-7 -6 M88 24 l7 -6" stroke="#C58A2B" stroke-width="2.2" stroke-linecap="round"/>
<text x="60" y="96" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">搓热手心·空心掌捂眼</text>
</svg>`;

CARE.SVG.handRelax = `<svg viewBox="0 0 120 100">
<path d="M40 88 V44 q0 -12 6 -12 q6 0 6 12 V26 q0 -12 6 -12 q6 0 6 12 v14 q0 -10 6 -10 q6 0 6 10 v22 q0 16 -10 26 q-4 4 -10 4 h-6 q-12 0 -14 -12" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4" stroke-linejoin="round"/>
<path d="M58 30 L58 62 M70 36 L70 62" stroke="#E07A5F" stroke-width="1.6" opacity=".5"/>
<path d="M86 52 L100 60 L94 70" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="102" cy="72" rx="6" ry="5" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2"/>
<path d="M92 78 l8 6 M88 84 l6 6" stroke="#C58A2B" stroke-width="2.2" stroke-linecap="round"/>
<text x="58" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">另一手轻拉·手腕保持伸展</text>
</svg>`;

/* ============ 部位养护 ============ */
CARE.parts = [
  {
    id: 'neck', icon: '🧣', name: '肩背放松', who: '仅限今天没有头晕、视物异常、走路不稳或手脚麻木时',
    avoid: '反复眩晕需要先由医生明确原因。未经过医生或康复师确认，不在本应用中练颈部转动、侧屈、后仰或抗阻。',
    items: [
      { name: '热敷肩颈', dur: 180, svg: 'hotpack', target: '3 分钟', steps: ['用 40~45℃ 热毛巾敷后颈和肩膀。', '温度以温热舒服为准，不烫不刺痛。'], caution: '皮肤感觉迟钝时先用手腕内侧试温，避免烫伤。' },
      { name: '肩胛后缩', dur: 60, svg: 'shoulderSqueeze', target: '10 次 × 2 组', steps: ['坐在有靠背的稳固椅子上，两臂自然下垂。', '肩胛骨轻轻往中间、往下收。', '停 2 秒后慢慢放松。'], caution: '头颈保持自然，不要耸肩。出现头晕、手麻或疼痛加重立即停止。' },
      { name: '坐姿扩胸', dur: 60, svg: 'chestStretch', target: '10 秒 × 4 次', steps: ['双脚踩地，眼睛平视。', '两肩轻轻向后下方打开，胸口舒展到舒服即可。'], caution: '不仰头、不屏气，不追求大幅度。' }
    ]
  },
  {
    id: 'waist', icon: '🪑', name: '腰椎 / 腰背养护', who: '久坐腰痛、腰肌劳损、站久了腰酸的人',
    avoid: '腰痛急性发作期（疼得厉害、腿麻）不要做锻炼，先休息并就医。不做"小燕飞"、不吊单杠、不暴力推拿。',
    items: [
      { name: '骨盆后倾', dur: 60, svg: 'bridge', target: '10 次 × 2 组', steps: ['仰卧屈膝，双脚踩实地面。', '腰部慢慢压向地面（肚脐往里收），停 3 秒再放松。'], caution: '动作要小、要慢，用肚子发力，不是用腰硬顶。' },
      { name: '臀桥', dur: 60, svg: 'bridge', target: '10 次 × 2 组', steps: ['仰卧屈膝，双脚与肩同宽。', '臀部慢慢抬起，肩、髋、膝成一条线，停 2 秒慢慢落下。'], caution: '抬到舒服的高度就行，不要过度顶腰。不憋气。' },
      { name: '猫牛式', dur: 90, svg: 'catCow', target: '8 个来回', steps: ['跪姿，双手双膝撑地，手腕在肩下、膝盖在髋下。', '吸气时慢慢塌腰抬头，呼气时慢慢弓背低头。'], caution: '全程慢、幅度小，脖子跟着躯干走，不要单独用力甩头。' },
      { name: '屈膝抱腿', dur: 60, svg: 'bicycle', target: '每侧 30 秒', steps: ['仰卧，双手抱住一侧膝盖往胸口带。', '保持 30 秒，换另一侧。'], caution: '腰下可垫小枕头，动作要轻。' }
    ]
  },
  {
    id: 'eye', icon: '👀', name: '眼部放松', who: '长时间看屏幕、眼干眼涩、用眼疲劳的人',
    avoid: '不要用力按压眼球。眼睛红肿、疼痛、视力突然变化请就医。',
    items: [
      { name: '20-20-20 法则', dur: 60, svg: 'eyeRelax', target: '每 20 分钟一次', steps: ['每看屏幕 20 分钟，抬头看 6 米外的地方 20 秒。', '同时多眨几次眼睛。'], caution: '这是最有效也最省事的护眼方法，比眼药水管用。' },
      { name: '搓手熨目', dur: 60, svg: 'eyeRelax', target: '30 秒 × 2 组', steps: ['两手心快速对搓 30 下至发热。', '空心掌轻轻扣在眼睛上，不要压眼球，停留 30 秒。'], caution: '手要洗干净，不要压迫眼球。' },
      { name: '眼球转动', dur: 45, svg: 'eyeRelax', target: '各方向 4 圈', steps: ['闭眼，眼球慢慢向上、下、左、右各看一次。', '再慢慢顺时针、逆时针各转 4 圈。'], caution: '速度一定要慢。转动时如果头晕，就睁开眼停下。' }
    ]
  },
  {
    id: 'hand', icon: '✋', name: '手部 / 腕部放松', who: '鼠标手、打字多、手部发麻、抱孩子后手腕疼的人',
    avoid: '手腕疼痛明显、夜间麻醒，可能提示腕管综合征，请就医。不要用力掰手指。',
    items: [
      { name: '腕部伸展', dur: 60, svg: 'handRelax', target: '每侧 20 秒 × 2', steps: ['手臂伸直，掌心向下。', '另一手轻压手背，让手腕向下弯，停 20 秒。换掌心向上再来一次。'], caution: '是牵拉不是掰，有刺痛就减轻力度。' },
      { name: '握拳张开', dur: 45, svg: 'handRelax', target: '15 次 × 2 组', steps: ['五指用力张开保持 3 秒。', '再慢慢握拳保持 3 秒，反复做。'], caution: '动作慢，不要甩手。' },
      { name: '手指按摩', dur: 60, svg: 'handRelax', target: '1 分钟', steps: ['用另一手的拇指和食指，从指根到指尖逐根轻捏。', '最后揉一揉手掌和大鱼际。'], caution: '力道轻，以舒服为准。' }
    ]
  }
];

/* 本版本只开放与当前定制对象相关、已经完成内容复核的肩背模块。 */
CARE.parts = CARE.parts.filter(p => p.id === 'neck');

/* ============ 作息养护 ============ */
CARE.routine = [
  {
    id: 'sleep', icon: '😴', name: '睡眠调理',
    points: [
      '固定起床时间比固定睡觉时间更重要——每天同一时间起床，生物钟会自己校准。',
      '睡前一小时关掉短视频和新闻，屏幕蓝光和情绪波动都会推迟困意。',
      '卧室只用来睡觉。躺床上 20 分钟睡不着就起来，到客厅做点枯燥的事，困了再回床。',
      '下午两点后不喝咖啡、浓茶；睡前 2 小时不大量喝水，减少起夜。',
      '午睡 20~30 分钟为宜，超过 40 分钟会影响晚上入睡。',
      '枕头高度：仰睡约一拳高，侧睡与肩同宽；脖子悬空或过度弯曲都会加重颈椎负担。'
    ]
  },
  {
    id: 'stayup', icon: '🌙', name: '熬夜修复',
    points: [
      '熬夜后不要补觉到中午，比平时晚起 1 小时即可，否则当晚更难入睡。',
      '第二天饮食清淡、多喝水，别用油腻夜宵和甜食"补偿"。',
      '白天晒 10~20 分钟太阳，帮助重置生物钟。',
      '避免连续熬夜——一次熬夜需要两三天才能恢复，连熬会明显影响免疫力和血糖。',
      '熬夜后不做高强度运动，做舒缓拉伸或散步 15 分钟更合适。'
    ]
  },
  {
    id: 'morning', icon: '🌅', name: '晨起养生',
    points: [
      '醒来不要立刻坐起，先躺 30 秒活动手脚，再慢慢侧身坐起（尤其有颈椎问题或血压偏低的人）。',
      '空腹喝 100~200 毫升温水，补充一夜的水分流失。',
      '需要空腹服药的（如左甲状腺素），起床后先服药，30~60 分钟后再吃早餐。',
      '排便要定时，不要久蹲用力（会增加腹压，加重痔疮和下肢静脉负担）。',
      '早餐一定要有蛋白质：一个蛋 + 一杯奶/豆浆，比只吃稀饭馒头顶饿得多。'
    ]
  }
];

/* ============ 舒缓课程 ============ */
CARE.relax = [
  {
    id: 'stretch', icon: '🧘', name: '全身拉伸放松', min: 8, level: '轻松',
    items: [
      { name: '颈肩舒展', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['坐或站直，一手过头轻贴对侧耳朵。', '头慢慢侧屈，停 20 秒换边。'], caution: '不要转头、不要后仰。' },
      { name: '扩胸开肩', dur: 60, svg: 'chestStretch', target: '20 秒 × 3', steps: ['双手在身后交叉或扶椅背。', '两肩向后展开，胸慢慢打开，停 20 秒。'], caution: '肩膀下沉，不要耸肩。' },
      { name: '猫牛式', dur: 90, svg: 'catCow', target: '8 个来回', steps: ['跪姿四点支撑。', '吸气塌腰抬头，呼气弓背低头，慢慢交替。'], caution: '幅度小、速度慢。' },
      { name: '腿后侧拉伸', dur: 90, svg: 'kneeExtend', target: '每侧 30 秒', steps: ['坐姿，一腿伸直脚尖朝上。', '身体慢慢前倾到有拉伸感，停 30 秒换腿。'], caution: '背要直，是髋部前倾不是低头弓背。' }
    ]
  },
  {
    id: 'breath', icon: '🌬️', name: '呼吸训练', min: 5, level: '轻松',
    items: [
      { name: '腹式呼吸', dur: 120, svg: 'breath', target: '10 次', steps: ['一手放胸口一手放肚子。', '鼻子吸气 4 秒，感觉肚子鼓起；嘴巴呼气 6 秒。'], caution: '呼气比吸气长。头晕就放慢。' },
      { name: '4-7-8 呼吸', dur: 120, svg: 'breath', target: '6 轮', steps: ['吸气 4 秒 → 屏气 7 秒 → 呼气 8 秒。', '做 6 轮即可。'], caution: '屏气不适就缩短或跳过屏气，不要勉强。' },
      { name: '搓手熨目收功', dur: 60, svg: 'palmEyes', target: '1 分钟', steps: ['搓热双手，空心掌捂眼 30 秒。', '同时慢慢呼吸，全身放松。'], caution: '不要压迫眼球。' }
    ]
  },
  {
    id: 'mind', icon: '🕯️', name: '睡前放松', min: 10, level: '轻松',
    items: [
      { name: '仰卧屈膝放松', dur: 120, svg: 'bridge', target: '2 分钟', steps: ['仰卧屈膝，双脚踩床。', '闭上眼睛，把注意力放在呼吸上。'], caution: '腰下可垫薄枕。' },
      { name: '腹式呼吸', dur: 120, svg: 'breath', target: '10 次', steps: ['鼻吸 4 秒、口呼 6 秒。', '感受肚子起伏。'], caution: '全程放松，不要用力。' },
      { name: '靠墙抬腿', dur: 240, svg: 'legsUpWall', target: '4 分钟', steps: ['臀部靠近墙，双腿贴墙竖起。', '全身放松，慢慢呼吸。'], caution: '腿麻、腰痛、头晕就立刻放下。' }
    ]
  }
];

/* 舒缓课程含颈部、平衡和仰卧动作，待专业人员逐项确认后再开放。 */
CARE.relax = [];

/* 通用科普（生活养护，非医疗） */
CARE.notes = [
  { t: '久坐每 40 分钟起来活动 2 分钟', d: '促进下肢回流，也能让颈椎和腰椎"换口气"。' },
  { t: '避免长时间保持同一姿势', d: '看手机或做家务时定时换姿势；不要求刻意挺直或忍痛维持。' },
  { t: '步行量按当天状态分次完成', d: '选择平整、明亮的路面；头晕、腿痛明显加重、胸闷或气短时立即停止。' },
  { t: '喝水少量多次', d: '每次 100~200 毫升，别等口渴再喝。心肾功能异常者遵医嘱控制水量。' },
  { t: '体重管理以稳定、可持续为主', d: '不因甲状腺手术自动减餐；如需要减重，结合复查结果和专业建议逐步调整。' },
  { t: '便秘要及时调理', d: '长期便秘会增加腹压，加重痔疮和下肢静脉曲张。' }
];
