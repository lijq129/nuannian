# 暖年 v0.3 设计基线

日期：2026-09-10。以当前工作目录为准，v0.2 的内容修复继续有效。

## 视觉方向

温和、真实的日常生活感。暖白底 `#F7F7F2`，主色深绿 `#315B49`，正文 `#263C33`，辅助文字 `#5C6860`，少量陶土色用于饮食和提示。红色只用于重要风险信息。

字体优先 Noto Sans SC 和设备原生中文无衬线字体，不联网加载字体。保留标准、大、特大三档，默认大字号；主体文字多数在 16～19px，标题约 28～32px。统一圆角线性 SVG 图标，不使用彩色表情图标、3D 塑料图标或自动漂浮动画。

页面都使用明确的标题、分段导航和舒适的行距。移动端保持五栏底部导航；宽屏使用侧栏。卡片以间距和浅边界分层，避免多种渐变和重复阴影。

参考：
- Apple Typography：https://developer.apple.com/design/human-interface-guidelines/typography
- Google Material 3 可用性研究：https://design.google/library/expressive-material-design-google-research

## 真实摄影来源

照片为现有摄影作品，不是本轮生成的 AI 图像。根据 Unsplash 页面标注的免费许可使用，原作者保留版权；下载时按用途缩小尺寸，未修改照片内容。图片均保存在本地，不依赖外站加载。

| 本地文件 | 作者 | 原始页面 |
| --- | --- | --- |
| assets/photos/window-light.jpg | Vicky | https://unsplash.com/photos/-Tlg2rRifIU |
| assets/photos/table.jpg | Peter Bravo de los Rios | https://unsplash.com/photos/LQLIS9AHLZw |
| assets/photos/chair.jpg | mk. s | https://unsplash.com/photos/Boh_83KbbDQ |
| assets/photos/walk.jpg | Josh Sorenson | https://unsplash.com/photos/LkcE7fSop1s |

许可：https://unsplash.com/license

摄影只用于日常场景和课程封面，不表示本人、治疗效果或专业动作示范。动作指导已改用真人示范图（assets/img/ex、assets/img/care），图片缺失时回退到原有可核对的 SVG 示意；关闭漂浮等无实际教学含义的动画。文字步骤与安全提示仍为动作的主要依据。

「活动养护 → 视频」页按博主整理第三方（抖音）锻炼视频，通过抖音开放平台官方播放器（`open.douyin.com/player/video`）站内嵌入，或跳转原平台观看；仅作动作演示参考，不替代专业指导，不代表已逐条完成发布者身份与适用人群审核。条目视频 ID 见 `js/data-fit-video.js`；未配置 ID 的条目退化为「在抖音看」。本应用面向长辈友好/低强度场景，页面标注强度并对「进阶」加提示。

## 验证

使用独立浏览器上下文打开本地 index.html，未操作真实用药记录。检查 5 个主页面、今日三餐/明日推荐（采购清单 + 可做的菜式）、菜谱及展开详情、活动/安全须知、养护合并页（课程/视频/作息/安全须知，含 13 套课程与抖音跟练合集）、我的/收藏/打卡/协议、编辑表单和暂停状态的跟练页。检查 320、390、768、1280px 宽度和特大字体，记录脚本错误、失效图片、横向越界及残留表情图标。

脚本：scripts/visual-check.cjs。截图和结果：qa/。自动化结果不能替代真实使用者对文字大小和操作习惯的反馈。

同轮修复首页和菜谱搜索的中文输入法问题：组词期间保留输入节点，选字提交后才刷新结果，并保留光标位置。scripts/search-check.cjs 使用浏览器 IME 协议验证组词、提交、中间插字、删除、粘贴和特殊字符；未人工操作 Windows 输入法候选窗口。
