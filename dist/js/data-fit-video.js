/* 当前正式跟练库，2026-09-11。
 * 原有3组14条完整保留，已核对具体公开视频来源；q仅为历史检索线索，不用于UI。
 * 新增可播放视频作为补充，不能取代或删减原有内容。见 FIT_VIDEO_NOTES.md。
 */
const FIT_COLLECTIONS = [
  {
    id: 'zoey', name: '周六野 Zoey', tag: '新手友好', q: '周六野Zoey 跟练',
    desc: '原有合集：全身有氧、瑜伽、肩颈与上肢内容。分类标签沿用原设置，不代表适合所有人。',
    videos: [
      { title: '10 分钟八段锦跟练', focus: '久坐放松 · 肩颈腰背', minutes: 10, level: '入门', id: 'collection-1', bv: 'BV1Hu4y1v7sL', sourceTitle: "10分钟八段锦跟练｜呼吸指导，拉伸解压赶走负能量【周六野Zoey】", up: "周六野Zoey", duration: 812, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '周六野 八段锦 跟练' },
      { title: '15 分钟全身解压瑜伽', focus: '放松肩颈 · 缓解腰酸', minutes: 15, level: '入门', id: 'collection-2', bv: 'BV1PV411v7Ej', sourceTitle: "15分钟全身解压拉伸瑜伽｜7天瘦身｜0基础、改善腰酸背疼、肩颈酸痛，改善腰臀腿线条、增加柔韧性【周六野Zoey】", up: "周六野Zoey", duration: 1007, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '周六野 全身解压瑜伽' },
      { title: '20 分钟站立有氧（护膝）', focus: '全身 · 无跳跃', minutes: 20, level: '适中', id: 'collection-3', bv: 'BV1pu411f75A', sourceTitle: "20min轻松欢乐暴汗有氧运动｜全程站立小空间友好｜适合酒店宿舍｜膝友好｜无工具【周六野Zoey】", up: "周六野Zoey", duration: 1499, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '周六野 站立有氧' },
      { title: '10 分钟改善高低肩 / 耸肩', focus: '肩颈 · 斜方肌', minutes: 10, level: '入门', id: 'collection-4', bv: 'BV16A411Y7bu', sourceTitle: "10分钟改善高低肩运动｜舒缓肩颈酸痛、斜方肌肿大等问题｜床上运动【周六野Zoey】", up: "周六野Zoey", duration: 936, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '周六野 改善高低肩' },
      { title: '5 分钟瘦手臂', focus: '上肢 · 零器械', minutes: 5, level: '入门', id: 'collection-5', bv: 'BV1yW411N7uG', sourceTitle: "5分钟瘦手臂运动，无工具坐着完成超酸爽！【周六野Zoey】", up: "周六野Zoey", duration: 598, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '周六野 瘦手臂' }
    ]
  },
  {
    id: 'aurora', name: '欧阳春晓 Aurora', tag: '体态塑形', q: '欧阳春晓Aurora 跟练',
    desc: '原有合集：体态与局部塑形。保留原条目，不作为颈椎或腿部疾病的治疗方案。',
    videos: [
      { title: '20 分钟沙漏腰（站立无跑跳）', focus: '核心 · 腰线', minutes: 20, level: '适中', id: 'collection-6', bv: 'BV1vU4y1g7Pg', sourceTitle: "追剧7天练出沙漏腰？！20min站立无跑跳 不费脖子不伤腰！新手/大基数可冲！！", up: "欧阳春晓Aurora", duration: 1201, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '欧阳春晓 沙漏腰' },
      { title: '12 分钟下半身体态训练', focus: '髋 · 核心 · 腿型', minutes: 12, level: '适中', id: 'collection-7', bv: 'BV1GX4y1j7xr', sourceTitle: "腿型臀型根本性矫正｜缩腰收腹提臀｜核心收紧培养【12分钟体验版】", up: "欧阳春晓Aurora", duration: 898, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '欧阳春晓 下半身体态' },
      { title: '少女背 · 直角肩', focus: '肩背 · 含胸驼背', minutes: 10, level: '入门', id: 'collection-8', bv: 'BV1AV41167Pr', sourceTitle: "10分钟get直角肩少女背/改善含胸驼背7天见效/女神气质必修课", up: "欧阳春晓Aurora", duration: 842, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: '欧阳春晓 直角肩 少女背' },
      { title: '12 分钟瘦小腿', focus: '小腿线条', minutes: 12, level: '入门', id: 'collection-9', bv: 'BV1af4y1V7ZJ', sourceTitle: "根本性瘦小腿10min跟练！拯救扁平足,强化足背屈｜拉长跟腱,矫正腿型", up: "欧阳春晓Aurora", duration: 592, page: 1, checked: '2026-09-11', matchNote: "原条目标注 12 分钟，已接入同一博主的 10 分钟小腿跟练版；全片实际 9:52。", q: '欧阳春晓 瘦小腿' }
    ]
  },
  {
    id: 'low', name: '低冲击博主合集', tag: '大基数 / 长辈友好', q: '低冲击 站立 无跳跃 跟练',
    desc: '原有合集：MIZI、Jo姐、Eleni Fit 等。低冲击不等于低强度，也不等于对她适用。',
    videos: [
      { title: 'MIZI · 30 分钟全程站立燃脂', focus: '无跳跃 · 不扰民', minutes: 30, level: '适中', id: 'collection-10', bv: 'BV1RP8iznE7c', sourceTitle: "MIZI 燃脂健走🔥30分钟走路减脂训练｜无跳跃、无深蹲、无弓步", up: "MIZI", duration: 2006, page: 1, checked: '2026-09-11', matchNote: "接入 MIZI 的 30 分钟无跳跃健走版，保留完整片头与说明。", q: 'MIZI 站立燃脂' },
      { title: 'MIZI · 10 分钟站立拉伸', focus: '运动后放松', minutes: 10, level: '入门', id: 'collection-11', bv: 'BV1pUbQzkEje', sourceTitle: "MIZI 10分钟全身站立拉伸 – 无需瑜伽垫", up: "MIZI", duration: 653, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: 'MIZI 站立拉伸' },
      { title: 'Jo姐 · 30 分钟快乐踏步有氧', focus: '低冲击 · 大基数友好', minutes: 30, level: '入门', id: 'collection-12', bv: 'BV1iJcMzvESC', sourceTitle: "【Jo姐的踏步燃脂】30min｜低冲击有氧 膝盖友好 新手友好", up: "Jo姐-growwithjo", duration: 1925, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: 'Jo姐 踏步有氧' },
      { title: 'Eleni Fit · 45 分钟站立 HIIT', focus: '无跳跃 · 全身', minutes: 45, level: '进阶', id: 'collection-13', bv: 'BV1YzYDzeEZm', sourceTitle: "Eleni Fit - 45分钟全身有氧HIIT全程站立 暴汗减脂 塑形瘦身", up: "EleniFit伊莉妮", duration: 2794, page: 1, checked: '2026-09-11', matchNote: "保留完整视频，实际全片时长含片头和说明，与原条目概称可能不同。", q: 'Eleni Fit 站立HIIT' },
      { title: '低冲击 · 10 分钟运动前热身', focus: '运动前激活', minutes: 10, level: '入门', id: 'collection-14', bv: 'BV1JcgzzHEUx', sourceTitle: "MIZI 10分钟晨间热身运动｜新手友好，全程站立", up: "MIZI", duration: 629, page: 1, checked: '2026-09-11', matchNote: "接入 MIZI 的 10 分钟全程站立晨间热身版。", q: '低冲击 站立 热身' }
    ]
  }
];

const FIT_VIDEOS = [
  {
    id: 'ankle', name: '踝泵 · 5 分钟计时跟练',
    bv: 'BV12DbH6UEfS', title: '踝泵跟练5分钟', up: 'l123456hy', duration: 359,
    focus: '脚踝屈伸', format: '真人示范 · 分组计时',
    desc: '含开场说明，之后按计时交替进行脚踝屈伸。不是静脉曲张治疗课程，也不替代血管专科评估。',
    caution: '先请医生或康复师确认目前腿部情况允许做踝泵。只在舒适范围活动，不用力绷到极限，不照搬视频中的组数；出现疼痛加重即停止。',
    checked: '2026-09-11'
  },
  {
    id: 'hands', name: '手指活动 · 口令跟练',
    bv: 'BV1WF411v7jg', title: '【手指体操】-山东省立医院东院神经内科病房健康宣教', up: 's140335', duration: 269,
    focus: '手指与手部', format: '真人示范 · 口令计数',
    desc: '跟随示范做手指活动，跟不上可暂停。仅作手部活动参考，不承诺预防或治疗认知障碍；上传账号未核验为医院官方账号。',
    caution: '坐稳，屏幕放到接近平视的位置，颈部保持自然。手部有伤、术后或疼痛时先询问专业人员；不硬掰手指，不追求速度。',
    checked: '2026-09-11'
  }
];
