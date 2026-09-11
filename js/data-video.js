/*
 * 视频发布边界
 * 旧的单动作示范映射仍关闭，不能作为已审核视频重新开启。
 * 独立跟练库见 data-fit-video.js；它不等于课程配套或个体医疗处方。
 */

const VIDEOS = {
  intro: '身体动作视频正在逐条核对发布者、动作内容和适用人群，完成专业审核前暂不开放。',
  groups: [],
  DEMO_BVID: {},
  DEMO_DEFAULT: {},
  compliance: '身体动作视频仅在完成专业审核后开放。'
};

function demoBvid() {
  return '';
}

/* 烹饪视频只按明确键值匹配；不以子串或搜索首条结果作兜底。 */

function videoKey(raw) {
  return String(raw || '')
    .replace(/[（(][^）)]*[）)]/g, '')
    .replace(/\s*做法.*$/, '')
    .replace(/\s+/g, '')
    .trim();
}

function videoInfo(raw) {
  const src = (typeof VIDEO_MAP !== 'undefined') ? VIDEO_MAP : null;
  if (!src) return null;
  const key = videoKey(raw);
  return Object.prototype.hasOwnProperty.call(src, key) ? src[key] : null;
}

function recipeBv(name) {
  const v = videoInfo(name);
  return v ? v.bv : '';
}
