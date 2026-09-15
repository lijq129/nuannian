/* 锻炼数据：颈痛伴眩晕的保守活动原则 + 腿部静脉曲张的日常活动与就医边界 */
const EX = {};

/* ---------------- SVG 动作图示 ---------------- */
const SVG = {};

SVG.hotpack = `<svg viewBox="0 0 120 100">
<rect x="16" y="66" width="46" height="5" rx="2.5" fill="#EFE4D9"/><rect x="20" y="71" width="5" height="21" rx="2" fill="#EFE4D9"/>
<rect x="58" y="26" width="5" height="40" rx="2.5" fill="#EFE4D9"/>
<path d="M50 44 C55 51 55 59 53 66" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round"/>
<line x1="52" y1="66" x2="88" y2="66" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<line x1="88" y1="66" x2="88" y2="92" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<line x1="88" y1="92" x2="98" y2="92" stroke="#5B7C99" stroke-width="5" stroke-linecap="round"/>
<line x1="51" y1="49" x2="68" y2="58" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<line x1="68" y1="58" x2="82" y2="55" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<circle cx="46" cy="29" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M38 27 Q46 20 54 27 Q46 33 38 27Z" fill="#F6C9A8" stroke="#E07A5F" stroke-width="2"/>
<path d="M50 38 Q56 41 52 45" stroke="#E07A5F" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M40 24 Q46 17 54 21 Q60 24 58 30 Q50 34 44 31 Q38 29 40 24Z" fill="#FBD9B4" stroke="#C58A2B" stroke-width="2"/>
<path d="M34 20 l-5 -3 M34 26 l-5 2 M62 24 l6 -3 M62 30 l6 1" stroke="#C58A2B" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

SVG.shoulderSqueeze = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="20" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 31 L60 62" stroke="#5B7C99" stroke-width="14" stroke-linecap="round" opacity=".9"/>
<path d="M46 36 L30 46 L34 62" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M74 36 L90 46 L86 62" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<circle cx="46" cy="35" r="5" fill="#E07A5F" opacity=".25"/>
<circle cx="74" cy="35" r="5" fill="#E07A5F" opacity=".25"/>
<path d="M58 38 l-10 -3 m10 3 l10 -3" stroke="#E07A5F" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M46 40 l6 -8 M74 40 l-6 -8" stroke="#5F9377" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-dasharray="3 2.5"/>
<text x="60" y="86" font-size="9" fill="#5F9377" text-anchor="middle" font-family="sans-serif">肩胛骨向内夹</text>
</svg>`;

SVG.chinTuck = `<svg viewBox="0 0 120 100">
<rect x="14" y="66" width="46" height="5" rx="2.5" fill="#EFE4D9"/><rect x="18" y="71" width="5" height="21" rx="2" fill="#EFE4D9"/>
<rect x="60" y="24" width="5" height="42" rx="2.5" fill="#EFE4D9"/>
<path d="M52 44 C57 51 57 59 55 66" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round"/>
<line x1="55" y1="66" x2="90" y2="66" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<line x1="90" y1="66" x2="90" y2="92" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<line x1="90" y1="92" x2="100" y2="92" stroke="#5B7C99" stroke-width="5" stroke-linecap="round"/>
<line x1="53" y1="50" x2="70" y2="58" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<line x1="70" y1="58" x2="84" y2="55" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<circle cx="48" cy="30" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<circle cx="52" cy="28" r="2" fill="#E07A5F"/>
<path d="M52 39 Q58 42 54 47" stroke="#E07A5F" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<g opacity=".55"><circle cx="34" cy="30" r="9" fill="none" stroke="#9A8D84" stroke-width="1.8" stroke-dasharray="3 3"/>
<path d="M38 39 Q44 42 40 47" stroke="#9A8D84" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>
<path d="M56 22 L34 22" stroke="#5F9377" stroke-width="2.4" fill="none" stroke-linecap="round" marker-end="url(#a1)"/>
<defs><marker id="a1" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#5F9377"/></marker></defs>
<text x="60" y="14" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">头水平后移·下巴微收</text>
</svg>`;

SVG.neckIsoF = `<svg viewBox="0 0 120 100">
<circle cx="52" cy="26" r="12" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<circle cx="57" cy="24" r="2.2" fill="#E07A5F"/>
<path d="M56 38 C62 44 62 56 60 66" stroke="#5B7C99" stroke-width="10" stroke-linecap="round" opacity=".9"/>
<path d="M54 46 Q40 52 30 42" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="27" cy="38" rx="6.5" ry="5.5" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.2" transform="rotate(-25 27 38)"/>
<path d="M46 16 l-7 -6 M46 22 l-8 -1" stroke="#5F9377" stroke-width="2.2" stroke-linecap="round"/>
<path d="M64 18 l7 -6" stroke="#C58A2B" stroke-width="2.2" stroke-linecap="round"/>
<text x="62" y="88" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">手压额头·脖子不动</text>
</svg>`;

SVG.neckIsoB = `<svg viewBox="0 0 120 100">
<circle cx="52" cy="26" r="12" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<circle cx="57" cy="24" r="2.2" fill="#E07A5F"/>
<path d="M56 38 C62 44 62 56 60 66" stroke="#5B7C99" stroke-width="10" stroke-linecap="round" opacity=".9"/>
<path d="M52 44 Q38 40 34 26 Q33 20 36 18" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="37" cy="14" rx="6.5" ry="5.5" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.2" transform="rotate(20 37 14)"/>
<path d="M46 20 l-6 4 M46 26 l-7 2" stroke="#5F9377" stroke-width="2.2" stroke-linecap="round"/>
<text x="66" y="88" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">手托后脑·轻轻对抗</text>
</svg>`;

SVG.neckIsoS = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="24" r="12" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 36 L60 66" stroke="#5B7C99" stroke-width="14" stroke-linecap="round" opacity=".9"/>
<path d="M50 40 Q36 44 32 34" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="29" cy="30" rx="6" ry="5.5" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.2" transform="rotate(-15 29 30)"/>
<path d="M70 40 Q84 44 88 34" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<ellipse cx="91" cy="30" rx="6" ry="5.5" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.2" transform="rotate(15 91 30)"/>
<path d="M48 18 l-5 -5 M72 18 l5 -5" stroke="#5F9377" stroke-width="2.2" stroke-linecap="round"/>
<text x="60" y="88" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">手掌抵太阳穴·耳朵找肩（不动）</text>
</svg>`;

SVG.chestStretch = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="18" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 29 L60 58" stroke="#5B7C99" stroke-width="14" stroke-linecap="round" opacity=".9"/>
<path d="M50 34 L24 30 L14 22" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M70 34 L96 30 L106 22" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M32 30 l0 -8 M88 30 l0 -8" stroke="#5F9377" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 2.5"/>
<path d="M44 40 Q60 50 76 40" stroke="#C58A2B" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<text x="60" y="90" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">两臂向后展开·胸口打开</text>
</svg>`;

SVG.shoulderRoll = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="20" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 31 L60 60" stroke="#5B7C99" stroke-width="14" stroke-linecap="round" opacity=".9"/>
<path d="M48 36 L34 58" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M72 36 L86 58" stroke="#FDEBDC" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M46 30 a12 12 0 1 0 6 20" stroke="#C58A2B" stroke-width="2.4" fill="none" marker-end="url(#a2)"/>
<path d="M74 50 a12 12 0 1 0 -6 -20" stroke="#C58A2B" stroke-width="2.4" fill="none" marker-end="url(#a2)"/>
<defs><marker id="a2" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<text x="60" y="90" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">肩膀向后画圈</text>
</svg>`;

SVG.anklePump = `<svg viewBox="0 0 120 100">
<rect x="8" y="42" width="42" height="5" rx="2.5" fill="#EFE4D9"/><rect x="12" y="47" width="5" height="34" rx="2" fill="#EFE4D9"/>
<rect x="52" y="20" width="5" height="22" rx="2.5" fill="#EFE4D9"/><rect x="48" y="40" width="14" height="4" rx="2" fill="#EFE4D9"/>
<path d="M46 46 C51 52 51 58 49 62" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round"/>
<line x1="49" y1="62" x2="86" y2="62" stroke="#5B7C99" stroke-width="8" stroke-linecap="round"/>
<line x1="86" y1="62" x2="86" y2="82" stroke="#5B7C99" stroke-width="8" stroke-linecap="round"/>
<path d="M86 82 L94 82 L98 88" stroke="#5B7C99" stroke-width="5" fill="none" stroke-linecap="round"/>
<g stroke="#C58A2B" stroke-width="2.2" fill="none"><path d="M104 74 q8 4 4 12" marker-end="url(#a3)"/><path d="M112 88 q-8 -2 -6 -10" marker-end="url(#a3)"/></g>
<defs><marker id="a3" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<circle cx="44" cy="32" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">脚尖勾起—绷直·反复</text>
</svg>`;

SVG.ankleCircle = `<svg viewBox="0 0 120 100">
<rect x="8" y="42" width="42" height="5" rx="2.5" fill="#EFE4D9"/><rect x="12" y="47" width="5" height="34" rx="2" fill="#EFE4D9"/>
<rect x="52" y="20" width="5" height="22" rx="2.5" fill="#EFE4D9"/><rect x="48" y="40" width="14" height="4" rx="2" fill="#EFE4D9"/>
<path d="M46 46 C51 52 51 58 49 62" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round"/>
<line x1="49" y1="62" x2="86" y2="62" stroke="#5B7C99" stroke-width="8" stroke-linecap="round"/>
<line x1="86" y1="62" x2="86" y2="80" stroke="#5B7C99" stroke-width="8" stroke-linecap="round"/>
<path d="M86 80 L94 82 L96 90" stroke="#5B7C99" stroke-width="5" fill="none" stroke-linecap="round"/>
<ellipse cx="98" cy="84" rx="13" ry="8" stroke="#C58A2B" stroke-width="2.2" fill="none" transform="rotate(-15 98 84)" marker-end="url(#a4)"/>
<defs><marker id="a4" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<circle cx="44" cy="32" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">脚踝慢慢画圈</text>
</svg>`;

SVG.kneeExtend = `<svg viewBox="0 0 120 100">
<rect x="10" y="40" width="40" height="5" rx="2.5" fill="#EFE4D9"/><rect x="14" y="45" width="5" height="36" rx="2" fill="#EFE4D9"/>
<rect x="52" y="16" width="5" height="26" rx="2.5" fill="#EFE4D9"/><rect x="48" y="38" width="14" height="4" rx="2" fill="#EFE4D9"/>
<path d="M46 44 C51 50 51 56 49 60" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round"/>
<line x1="49" y1="60" x2="80" y2="60" stroke="#5B7C99" stroke-width="8" stroke-linecap="round"/>
<line x1="80" y1="60" x2="80" y2="80" stroke="#5B7C99" stroke-width="8" stroke-linecap="round"/>
<path d="M49 60 L96 34" stroke="#5B7C99" stroke-width="8" stroke-linecap="round" opacity=".45"/>
<path d="M92 30 L102 26" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M88 30 l4 -10" stroke="#5F9377" stroke-width="2.2" fill="none" stroke-dasharray="3 2.5" marker-end="url(#a5)"/>
<defs><marker id="a5" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#5F9377"/></marker></defs>
<circle cx="44" cy="30" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">坐直·缓慢伸直膝盖</text>
</svg>`;

SVG.heelRaise = `<svg viewBox="0 0 120 100">
<line x1="8" y1="94" x2="112" y2="94" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<rect x="76" y="30" width="5" height="64" rx="2.5" fill="#EFE4D9"/>
<circle cx="44" cy="16" r="10" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M46 26 C52 34 52 50 50 60" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M50 60 L44 80 L44 92" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M50 60 L58 80 L58 92" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M42 92 L52 92 M56 92 L66 92" stroke="#5B7C99" stroke-width="5" stroke-linecap="round"/>
<path d="M46 30 L64 40 L62 26" stroke="#FDEBDC" stroke-width="6" fill="none" stroke-linecap="round"/>
<ellipse cx="62" cy="22" rx="5" ry="4" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2"/>
<path d="M40 82 l-8 -6 M40 88 l-8 -2" stroke="#C58A2B" stroke-width="2.2" fill="none" stroke-linecap="round" marker-end="url(#a6)"/>
<defs><marker id="a6" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<text x="66" y="72" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">扶稳·脚跟抬起</text>
</svg>`;

SVG.bicycle = `<svg viewBox="0 0 120 100">
<line x1="6" y1="82" x2="114" y2="82" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<rect x="14" y="66" width="34" height="16" rx="6" fill="#F3EDE6" stroke="#DCD2C7" stroke-width="1.6"/>
<circle cx="20" cy="72" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M28 74 L62 76" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M62 76 L88 56" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M88 56 L96 40" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M62 76 L82 76" stroke="#5B7C99" stroke-width="7" stroke-linecap="round" opacity=".45"/>
<path d="M82 76 L94 66" stroke="#5B7C99" stroke-width="7" stroke-linecap="round" opacity=".45"/>
<path d="M52 66 L34 58" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M46 84 L30 88" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M104 44 a16 16 0 1 1 -4 -14" stroke="#C58A2B" stroke-width="2.2" fill="none" marker-end="url(#a7)"/>
<defs><marker id="a7" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">仰卧·慢速空蹬</text>
</svg>`;

SVG.legsUpWall = `<svg viewBox="0 0 120 100">
<line x1="6" y1="86" x2="114" y2="86" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<rect x="76" y="6" width="6" height="80" fill="#EFE4D9"/>
<rect x="8" y="70" width="30" height="16" rx="6" fill="#F3EDE6" stroke="#DCD2C7" stroke-width="1.6"/>
<circle cx="22" cy="74" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M30 78 L54 82" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M54 82 L78 74" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M78 74 L80 26" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M54 82 L80 46" stroke="#5B7C99" stroke-width="7" stroke-linecap="round" opacity=".7"/>
<path d="M74 30 L86 30 M74 42 L86 42" stroke="#5F9377" stroke-width="2" stroke-linecap="round" opacity=".6"/>
<path d="M40 70 l-6 -8" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M30 88 L46 90" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<text x="48" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">臀靠墙·双腿上举放松</text>
</svg>`;

SVG.legShake = `<svg viewBox="0 0 120 100">
<line x1="6" y1="84" x2="114" y2="84" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="20" cy="70" r="9" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M28 74 L66 76" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M66 76 L96 56" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M96 56 L92 42" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M66 76 L98 72" stroke="#5B7C99" stroke-width="7" stroke-linecap="round" opacity=".6"/>
<path d="M98 72 L100 60" stroke="#5B7C99" stroke-width="7" stroke-linecap="round" opacity=".6"/>
<path d="M104 40 q5 6 0 12 M110 42 q5 6 0 12" stroke="#C58A2B" stroke-width="2.2" fill="none" stroke-linecap="round"/>
<path d="M46 66 L32 58" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">屈膝·轻轻抖动放松</text>
</svg>`;

SVG.walk = `<svg viewBox="0 0 120 100">
<line x1="6" y1="92" x2="114" y2="92" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="52" cy="16" r="10" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M54 26 C60 34 60 48 58 58" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M58 58 L44 74 L46 92" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M58 58 L72 72 L70 92" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M46 92 L54 92 M70 92 L80 92" stroke="#5B7C99" stroke-width="5" stroke-linecap="round"/>
<path d="M56 32 L40 44" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M56 32 L74 40" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M88 30 l7 3 M90 36 l7 2 M32 30 l-7 3" stroke="#C58A2B" stroke-width="2.2" stroke-linecap="round"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">平地慢走·鞋要合脚</text>
</svg>`;

SVG.breath = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="54" r="24" fill="#E7F2EA" stroke="#5F9377" stroke-width="2" opacity=".55"/>
<circle cx="60" cy="54" r="16" fill="#DCEAE1" stroke="#5F9377" stroke-width="2" opacity=".8"/>
<circle cx="60" cy="22" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 33 L60 60" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M50 40 L32 52 L36 66" stroke="#FDEBDC" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M70 40 L88 52 L84 66" stroke="#FDEBDC" stroke-width="6" fill="none" stroke-linecap="round"/>
<path d="M60 60 L48 84" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M60 60 L72 84" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<text x="60" y="98" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">鼻吸口呼·慢慢来</text>
</svg>`;

SVG.raiseArms = `<svg viewBox="0 0 120 100">
<line x1="6" y1="94" x2="114" y2="94" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="60" cy="20" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 31 L60 62" stroke="#5B7C99" stroke-width="13" stroke-linecap="round" opacity=".9"/>
<path d="M52 36 L44 18 L38 8" stroke="#FDEBDC" stroke-width="6.5" fill="none" stroke-linecap="round"/>
<path d="M68 36 L76 18 L82 8" stroke="#FDEBDC" stroke-width="6.5" fill="none" stroke-linecap="round"/>
<path d="M60 62 L52 94" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M60 62 L68 94" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M38 10 l-6 -6 M82 10 l6 -6" stroke="#5F9377" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 2.5"/>
<text x="60" y="99" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">双手上托·脚跟不动</text>
</svg>`;

SVG.oneArmUp = `<svg viewBox="0 0 120 100">
<line x1="6" y1="94" x2="114" y2="94" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<circle cx="60" cy="20" r="11" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M60 31 L60 62" stroke="#5B7C99" stroke-width="13" stroke-linecap="round" opacity=".9"/>
<path d="M52 36 L42 16 L40 6" stroke="#FDEBDC" stroke-width="6.5" fill="none" stroke-linecap="round"/>
<path d="M68 36 L78 58 L74 70" stroke="#FDEBDC" stroke-width="6.5" fill="none" stroke-linecap="round"/>
<path d="M60 62 L52 94" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M60 62 L68 94" stroke="#5B7C99" stroke-width="7" stroke-linecap="round"/>
<path d="M36 8 l0 -6" stroke="#5F9377" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 2.5"/>
<path d="M76 74 l0 8" stroke="#C58A2B" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="3 2.5"/>
<text x="60" y="99" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">一手上举一手下按</text>
</svg>`;

SVG.sitStand = `<svg viewBox="0 0 120 100">
<line x1="6" y1="94" x2="114" y2="94" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<rect x="14" y="60" width="34" height="5" rx="2.5" fill="#EFE4D9"/><rect x="18" y="65" width="5" height="29" rx="2" fill="#EFE4D9"/>
<circle cx="66" cy="22" r="10" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M68 32 C74 40 74 52 72 60" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M72 60 L64 78 L64 94" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M72 60 L80 78 L80 94" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M66 38 L54 40" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M70 38 L84 42" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<path d="M86 30 q6 8 0 16" stroke="#C58A2B" stroke-width="2.2" fill="none" marker-end="url(#a8)"/>
<defs><marker id="a8" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6Z" fill="#C58A2B"/></marker></defs>
<text x="60" y="99" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">坐—站·不憋气</text>
</svg>`;

SVG.balance = `<svg viewBox="0 0 120 100">
<line x1="6" y1="94" x2="114" y2="94" stroke="#EFE4D9" stroke-width="4" stroke-linecap="round"/>
<rect x="80" y="24" width="5" height="70" rx="2.5" fill="#EFE4D9"/>
<circle cx="50" cy="16" r="10" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M52 26 C58 34 58 48 56 58" stroke="#5B7C99" stroke-width="12" stroke-linecap="round" opacity=".9"/>
<path d="M56 58 L50 78 L50 94" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M56 58 L74 66 L78 60" stroke="#5B7C99" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M54 32 L76 30" stroke="#FDEBDC" stroke-width="6" stroke-linecap="round"/>
<ellipse cx="80" cy="29" rx="5" ry="4" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2"/>
<path d="M44 88 l-8 4 M60 88 l8 4" stroke="#C58A2B" stroke-width="2" stroke-linecap="round" opacity=".7"/>
<text x="54" y="99" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">扶稳·单腿站立</text>
</svg>`;

SVG.palmEyes = `<svg viewBox="0 0 120 100">
<circle cx="60" cy="46" r="26" fill="#FDEBDC" stroke="#E07A5F" stroke-width="2.4"/>
<path d="M46 42 q7 -7 14 0 M60 42 q7 -7 14 0" stroke="#E07A5F" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M50 58 q10 7 20 0" stroke="#E07A5F" stroke-width="2.4" fill="none" stroke-linecap="round"/>
<path d="M26 52 q-8 6 -2 16 q4 8 14 6" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M94 52 q8 6 2 16 q-4 8 -14 6" stroke="#5B7C99" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>
<path d="M40 22 q6 -10 14 -12 M80 22 q-6 -10 -14 -12" stroke="#C58A2B" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-dasharray="3 2.5"/>
<text x="60" y="96" font-size="8.5" fill="#5F9377" text-anchor="middle" font-family="sans-serif">搓热双手·捂眼放松</text>
</svg>`;

EX.SVG = SVG;

/* ---------------- 安全须知 ---------------- */
EX.safety = {
  neck: {
    title: '颈痛伴眩晕：先排除风险再活动',
    level: 'r',
    bans: [
      ['🚫', '头晕时继续练', '眩晕、视物异常、走路不稳、恶心或新发头痛时不要开始任何颈部动作。'],
      ['🚫', '自行快速或大幅转头', '动作是否适合取决于眩晕原因；未经过医生或康复师评估时不要反复绕颈、猛转或后仰。'],
      ['🚫', '颈部负重或自行牵引', '牵引角度、力度和适应证需要专业评估。'],
      ['🚫', '大力按摩、掰脖子或“正骨”', '非专业手法可能加重疼痛或造成损伤。'],
      ['🚫', '独自尝试容易失去平衡的动作', '有眩晕史时应优先坐姿，并确保身边有稳固支撑。']
    ],
    rules: [
      '反复出现眩晕时，先由医生排除内耳、神经、心血管和药物等原因，不自行认定为“颈椎压迫”。',
      '只练医生或康复师确认过的动作；本应用默认课程只安排坐姿肩背放松，不主动训练颈部活动度和抗阻。',
      '在不痛、不晕的范围内缓慢完成，全程正常呼吸。',
      '第一次做新动作时，最好有人在家并在稳固座椅旁进行。'
    ],
    stop: [
      '头晕、天旋地转',
      '恶心、想吐、出冷汗',
      '耳鸣、听不清、眼前发黑或视物成双',
      '手脚发麻、走路发飘',
      '脖子剧痛或头痛突然加重'
    ],
    emergency: '出现上述情况：立刻停止，在安全处坐下或侧躺，不要自行走动或继续测试动作。若同时出现说话不清、口角歪斜、单侧肢体无力、复视、吞咽困难、突然剧烈头痛或意识异常，立即呼叫 120。反复眩晕即使能自行缓解，也应尽快就医明确原因。'
  },
  leg: {
    title: '腿部：缓解症状不能代替血管评估',
    level: 'g',
    bans: [
      ['🚫', '单侧突然肿痛时继续活动', '突然出现一侧小腿肿胀、发热、压痛或颜色改变时，不要按摩、热敷或继续训练。'],
      ['🚫', '用力揉搓、刮痧曲张静脉', '可能损伤皮肤和血管；出现红肿热痛时尤其不要揉。'],
      ['🚫', '未经评估自行购买高压力弹力袜', '压力等级和尺寸需由医生或受训人员评估；动脉供血不良者可能不适合。'],
      ['🚫', '长时间久坐或久站', '每 30~40 分钟变换姿势，能安全行走时短走几分钟，不能走时做坐姿踝泵。'],
      ['🚫', '症状加重时继续高温泡脚', '高温可能让部分人的胀痛更明显；如泡脚后不适加重应停止。']
    ],
    rules: [
      '踝泵、短时平地步行和舒适抬腿可帮助小腿肌肉活动、缓解部分人的酸胀，但不能消除曲张静脉。',
      '症状持续或逐渐加重、出现皮肤色素改变、湿疹、破溃或曾经出血时，应预约血管外科评估。',
      '抬腿以舒服、容易起身为准；不要求把腿竖直贴墙。',
      '活动量分次完成，腿痛明显加重、胸闷或气短时立即停止。',
      '弹力袜只使用医生确认的压力等级和尺寸，并按要求检查皮肤。'
    ],
    stop: [
      '一条腿突然肿起来、发紧发亮',
      '小腿局部发热、压痛明显',
      '皮肤颜色变红、变紫或发黑',
      '曲张处破溃或出血',
      '胸痛、呼吸困难、咳血、心跳异常、晕厥',
      '走路时腿痛，休息后缓解但再次行走又出现'
    ],
    emergency: '单侧小腿突然肿痛、发热或颜色改变时，停止按摩、热敷和训练，尽快就医排查血栓。若出现胸痛、呼吸困难、咳血或晕厥，立即呼叫 120。曲张静脉出血时先平躺、抬高患肢并用干净敷料持续直接压迫，仍出血或出血量大时立即急救。'
  }
};

/* ---------------- 课程 ---------------- */
EX.courses = [
  {
    id: 'neck',
    name: '肩背放松（无头晕时）',
    sub: '坐姿为主 · 不训练颈部抗阻和活动度',
    icon: '🧣',
    cls: 'n',
    minutes: 5,
    cat: 'part', tags: ['肩背放松', '坐姿', '低强度'],

    items: [
      { name: '热敷肩颈', dur: 180, svg: 'hotpack', target: '3 分钟', steps: ['用 40~45℃ 的热毛巾或热敷袋敷在后颈和肩膀上。', '温度以"温热舒服"为准，不烫不刺痛。', '肩膀完全放松，慢慢呼吸。'], caution: '皮肤感觉迟钝时一定先用手腕内侧试温，避免烫伤。' },
      { name: '肩胛后缩下沉', dur: 60, svg: 'shoulderSqueeze', target: '10 次 × 2 组', steps: ['坐直或站直，两臂自然下垂。', '两侧肩胛骨慢慢往中间夹，肩膀同时往下沉。', '夹住停 3 秒，再慢慢松开。'], caution: '只动肩胛骨，脖子不要跟着用力、不要耸肩。' },
      { name: '坐姿扩胸', dur: 60, svg: 'chestStretch', target: '10 秒 × 4 次', steps: ['坐在稳固椅子上，双脚踩地，眼睛看前方。', '两肩轻轻向后下方打开，胸口舒展到舒服即可。', '保持 10 秒，正常呼吸后放松。'], caution: '头颈保持自然，不追求大幅度。出现头晕、手麻、疼痛加重立即停止。' }
    ]
  },
  {
    id: 'leg',
    name: '腿部温和活动',
    sub: '坐姿踝泵 + 短时慢走 · 用于日常活动，不替代治疗',
    icon: '🦵',
    cls: 'l',
    minutes: 10,
    cat: 'part', tags: ['腿部', '无器械', '低强度', '静脉养护'],

    items: [
      { name: '坐姿踝泵', dur: 180, svg: 'anklePump', target: '15 次 × 3 组', steps: ['坐在有靠背的稳固椅子上，双脚踩地。', '脚尖慢慢向上勾，再慢慢向下踩。', '在舒服范围内反复，组间休息。'], caution: '不要追求最大幅度。若一侧小腿突然肿痛、发热或皮肤变色，不要做并尽快就医。' },
      { name: '坐姿脚踝画圈', dur: 120, svg: 'ankleCircle', target: '每侧各方向 8 圈', steps: ['坐稳，单脚轻轻离地。', '以脚踝为轴缓慢画小圈。', '换方向和另一侧。'], caution: '动作小而慢；出现抽筋、疼痛或麻木就停止。' },
      { name: '坐姿提踵', dur: 120, svg: 'heelRaise', target: '12 次 × 2 组', steps: ['坐稳，双脚踩地。', '前脚掌不动，双脚跟缓慢抬起。', '停 1 秒后缓慢放下。'], caution: '不要屏气；疼痛明显时减少次数或停止。' },
      { name: '平地短时慢走', dur: 180, svg: 'walk', target: '3 分钟', steps: ['穿合脚、防滑的鞋，在平整、明亮处慢走。', '速度以能正常说话为准。', '结束后坐下休息，观察腿部感觉。'], caution: '腿痛明显加重、胸痛、气短或头晕时立即停止。弹力袜只穿医生确认的压力等级和尺寸。' }
    ]
  },
  {
    id: 'whole',
    name: '全身温和活动',
    sub: '八段锦简化 + 平衡与力量 · 防跌倒',
    icon: '🌿',
    cls: 'w',
    minutes: 7,
    cat: 'quick', tags: ['全身', '无器械', '长辈友好'],

    items: [
      { name: '深呼吸热身', dur: 60, svg: 'breath', target: '6 次', steps: ['站直或坐直，一手放胸口一手放肚子。', '鼻子慢慢吸气 4 秒，感觉肚子鼓起来。', '嘴巴慢慢呼气 6 秒，肚子收回去。'], caution: '呼气比吸气长一点。头晕就放慢节奏。' },
      { name: '双手托天', dur: 60, svg: 'raiseArms', target: '6 次', steps: ['两手上提至胸前，掌心向上。', '慢慢向上托起，手臂伸直，眼睛平视。', '停 2 秒，两手从两侧慢慢落下。'], caution: '头不仰！眼睛始终平视前方，手臂不必完全伸直。' },
      { name: '单手举按', dur: 60, svg: 'oneArmUp', target: '左右各 6 次', steps: ['一手向上举起，掌心向上。', '另一手向下按，掌心向下。', '上下对拉停 2 秒，再慢慢收回换边。'], caution: '不转头、不侧屈，只是手臂上下对拉。' },
      { name: '坐站转换', dur: 90, svg: 'sitStand', target: '10 次 × 2 组', steps: ['坐在稳固的椅子上，双脚与肩同宽，脚跟略靠后。', '身体微微前倾，用腿的力量站起来。', '再慢慢坐回去，屁股碰到椅子就停。'], caution: '全程正常呼吸，绝不憋气。椅子要靠墙、不能带轮子。' },
      { name: '单腿站立', dur: 60, svg: 'balance', target: '每侧 20 秒 × 2 组', steps: ['一手扶住椅背或墙。', '一条腿轻轻抬起 2~3 厘米，保持 20 秒。', '换另一侧。站稳后可以试着减少手指的力道。'], caution: '一定要有扶的东西。这可作为平衡练习之一；频率以专业人员建议和自身耐受为准。' },
      { name: '搓手熨目收功', dur: 60, svg: 'palmEyes', target: '1 分钟', steps: ['两手心快速对搓 30 下，搓到发热。', '把温热的手心轻轻扣在双眼上，不要压眼球。', '停留 30 秒，同时慢慢呼吸。'], caution: '手上要干净。有眼部疾病时不要按压眼球。' }
    ]
  },
  {
    id: 'morning',
    name: '晨起唤醒',
    sub: '6 分钟把身体慢慢叫醒，适合起床后、早饭前',
    icon: '🌅',
    cls: 'w',
    minutes: 6,
    cat: 'scene', tags: ['晨起', '全身', '无器械'],

    items: [
      { name: '原地踏步', dur: 60, svg: 'march', target: '1 分钟', steps: ['站直，双手自然摆动。', '原地慢慢踏步，膝盖抬到舒服的高度。'], caution: '刚起床动作要慢，站不稳就扶着桌子。' },
      { name: '肩绕环', dur: 45, svg: 'shoulderRoll', target: '10 次 × 2 组', steps: ['两肩慢慢向上、向后、向下画圈。', '一圈约 3 秒。'], caution: '只绕肩，脖子放松不动。' },
      { name: '扩胸拉伸', dur: 45, svg: 'chestStretch', target: '15 秒 × 3 次', steps: ['双手在身后交叉或扶椅背。', '两肩后展，胸口打开，保持 15 秒。'], caution: '肩膀下沉，不憋气。' },
      { name: '双手托天', dur: 60, svg: 'raiseArms', target: '6 次', steps: ['两手在胸前上提，掌心向上。', '慢慢向上托起，眼睛平视，停 2 秒后从两侧落下。'], caution: '头不要仰，眼睛始终看前方。' },
      { name: '体侧伸展', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['一手臂过头，身体向对侧慢慢侧弯。', '停 20 秒，换另一侧。'], caution: '只侧屈，不转头、不后仰。' },
      { name: '深呼吸', dur: 45, svg: 'breath', target: '6 次', steps: ['鼻吸 4 秒、口呼 6 秒。', '把手放在肚子上感受起伏。'], caution: '呼气比吸气长，头晕就放慢。' }
    ]
  },
  {
    id: 'aftermeal',
    name: '饭后消食',
    sub: '8 分钟温和助消化，饭后 30 分钟做',
    icon: '🚶',
    cls: 'l',
    minutes: 8,
    cat: 'scene', tags: ['饭后', '低强度', '消食'],

    items: [
      { name: '站立放松呼吸', dur: 60, svg: 'breath', target: '8 次', steps: ['站直，双脚与肩同宽。', '鼻吸 4 秒、口呼 6 秒，肩膀放松。'], caution: '饭后不做弯腰、倒立、跳跃动作。' },
      { name: '原地踏步', dur: 120, svg: 'march', target: '2 分钟', steps: ['原地慢慢踏步，手臂自然摆动。', '速度以能正常说话为准。'], caution: '有胃下垂或腹部不适就放慢或停下。' },
      { name: '体侧伸展', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['站立，手臂过头向对侧侧弯。', '停 20 秒换边。'], caution: '动作轻，不要挤压腹部。' },
      { name: '坐姿踝泵', dur: 90, svg: 'anklePump', target: '20 次 × 3 组', steps: ['坐在椅子上，脚尖用力向上勾停 2 秒。', '再向下绷直停 2 秒。'], caution: '用于温和活动踝关节；出现单侧腿突然肿痛、发热或变色时不要做。' },
      { name: '慢走', dur: 120, svg: 'walk', target: '2 分钟', steps: ['平地慢慢走，速度舒缓。', '可以在客厅或走廊来回走。'], caution: '路面要平、光线要亮，注意脚下。' }
    ]
  },
  {
    id: 'posture',
    name: '圆肩驼背矫正',
    sub: '10 分钟打开胸前、练稳肩胛，办公族日常',
    icon: '🧍',
    cls: 'n',
    minutes: 10,
    cat: 'posture', tags: ['体态', '肩背', '办公族'],

    items: [
      { name: '收下巴', dur: 60, svg: 'chinTuck', target: '5 秒 × 8 次', steps: ['坐直，眼睛平视。', '头水平向后平移，做出"双下巴"的感觉，停 5 秒。'], caution: '不低头不仰头。有眩晕立刻停止。' },
      { name: '肩胛后缩', dur: 60, svg: 'shoulderSqueeze', target: '10 次 × 2 组', steps: ['两臂自然下垂，肩胛骨往中间夹。', '停 3 秒再松开。'], caution: '不耸肩，脖子放松。' },
      { name: '扩胸拉伸', dur: 60, svg: 'chestStretch', target: '20 秒 × 3 次', steps: ['双手身后交叉或扶椅背。', '肩后展、胸打开，保持 20 秒。'], caution: '肩膀下沉，不憋气。' },
      { name: '肩绕环', dur: 45, svg: 'shoulderRoll', target: '10 次 × 2 组', steps: ['两肩向后缓慢画圈。', '一圈约 3 秒。'], caution: '脖子保持不动。' },
      { name: '单臂上举侧屈', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['一手臂贴耳上举。', '身体向对侧慢慢侧弯，停 20 秒换边。'], caution: '只侧屈，不转头不后仰。' },
      { name: '靠墙站立', dur: 120, svg: 'shoulderSqueeze', target: '2 分钟', steps: ['后脑、肩、臀、脚跟尽量贴墙。', '收紧腹部，正常呼吸，保持 2 分钟。'], caution: '后脑贴墙不舒服就不要勉强，保持颈部自然中立位即可。' }
    ]
  },
  {
    id: 'activate',
    name: '全身激活 · 无跑跳',
    sub: '12 分钟低冲击，膝盖友好、不扰民',
    icon: '⚡',
    cls: 'w',
    minutes: 12,
    cat: 'quick', tags: ['低冲击', '减脂', '全身', '无器械'],

    items: [
      { name: '原地踏步热身', dur: 120, svg: 'march', target: '2 分钟', steps: ['原地踏步，手臂自然摆动。', '逐渐加快到微微发热。'], caution: '膝盖不舒服就减小抬腿幅度。' },
      { name: '肩绕环', dur: 45, svg: 'shoulderRoll', target: '10 次 × 2 组', steps: ['两肩向后画圈，一圈 3 秒。'], caution: '脖子不动。' },
      { name: '双手托天', dur: 60, svg: 'raiseArms', target: '8 次', steps: ['掌心向上托起，停 2 秒后从两侧落下。'], caution: '不仰头，眼睛平视。' },
      { name: '坐站转换', dur: 90, svg: 'sitStand', target: '10 次 × 2 组', steps: ['坐稳的椅子上，用腿的力量站起来。', '再慢慢坐回去。'], caution: '椅子要靠墙、不带轮子。全程正常呼吸，绝不憋气。' },
      { name: '扶稳提踵', dur: 60, svg: 'heelRaise', target: '15 次 × 2 组', steps: ['双手扶稳，脚跟慢慢抬起停 2 秒。', '再慢慢落下。'], caution: '一定要扶稳。站不稳就改成坐姿抬脚跟。' },
      { name: '单腿站立', dur: 60, svg: 'balance', target: '每侧 20 秒', steps: ['一手扶住椅背，一条腿抬起 2~3 厘米。', '保持 20 秒换边。'], caution: '必须有扶的东西。这可作为平衡练习之一，按自身耐受完成。' },
      { name: '原地踏步收尾', dur: 120, svg: 'march', target: '2 分钟', steps: ['放慢速度，慢慢走到呼吸平稳。'], caution: '结束后不要立刻坐下。' }
    ]
  },
  {
    id: 'balance',
    name: '平衡与防跌倒',
    sub: '扶着椅背练稳当 · 长辈居家首选',
    icon: '🧍',
    cls: 'w',
    minutes: 8,
    cat: 'balance', tags: ['平衡', '防跌倒', '长辈友好'],
    items: [
      { name: '原地踏步热身', dur: 60, svg: 'march', target: '1 分钟', steps: ['站直，手扶桌沿或椅背。', '慢慢原地踏步，膝盖抬到舒服的高度。'], caution: '刚起床或头晕时先坐着缓一缓，不要马上做。' },
      { name: '扶椅单腿站立', dur: 120, svg: 'balance', target: '每侧 20 秒 × 2 组', steps: ['一手扶住稳固椅背或墙面。', '一条腿轻轻抬起 2~3 厘米，保持 20 秒。', '换另一侧；站稳后再慢慢减少扶的力道。'], caution: '一定要有可扶的东西。这可作为平衡练习之一；频率以专业人员建议和自身耐受为准。' },
      { name: '坐站转换', dur: 120, svg: 'sitStand', target: '10 次 × 2 组', steps: ['坐在靠墙、无轮的椅子上，双脚与肩同宽。', '身体微微前倾，用腿的力量站起来，再慢慢坐回。'], caution: '全程正常呼吸，绝不憋气；膝盖疼痛明显时减少次数。' },
      { name: '扶稳提踵', dur: 90, svg: 'heelRaise', target: '12 次 × 2 组', steps: ['双手扶稳，脚跟慢慢抬起停 1~2 秒，再慢慢落下。'], caution: '站不稳就改成坐姿抬脚跟。' },
      { name: '侧向移步', dur: 90, svg: 'walk', target: '左右各 8 步', steps: ['手扶台面，沿台面慢慢向一侧走几步，再走回来。'], caution: '地面要干、无障碍物，光线要亮。' }
    ]
  },
  {
    id: 'office',
    name: '久坐舒展',
    sub: '办公、看手机后 · 肩颈和眼睛一起放松',
    icon: '💻',
    cls: 'n',
    minutes: 6,
    cat: 'posture', tags: ['办公', '肩颈', '眼部', '久坐'],
    items: [
      { name: '收下巴', dur: 60, svg: 'chinTuck', target: '5 秒 × 8 次', steps: ['坐直，眼睛平视。', '头水平向后平移，做出"双下巴"的感觉，停 5 秒。'], caution: '不低头不仰头；有眩晕立即停止。' },
      { name: '肩胛后缩', dur: 60, svg: 'shoulderSqueeze', target: '10 次 × 2 组', steps: ['两臂自然下垂，肩胛骨往中间夹，停 3 秒再松开。'], caution: '不耸肩，脖子放松。' },
      { name: '坐姿扩胸', dur: 60, svg: 'chestStretch', target: '15 秒 × 3 次', steps: ['两手背后相扣或扶椅背，肩后展、胸打开，保持 15 秒。'], caution: '肩膀下沉，不憋气。' },
      { name: '肩绕环', dur: 45, svg: 'shoulderRoll', target: '10 次 × 2 组', steps: ['两肩向后缓慢画圈，一圈约 3 秒。'], caution: '只绕肩，脖子不动。' },
      { name: '搓手熨目', dur: 60, svg: 'palmEyes', target: '1 分钟', steps: ['两手心对搓 30 下搓热，轻轻扣在双眼上停留 30 秒。'], caution: '手要干净；不要按压眼球。' },
      { name: '远眺放松', dur: 40, svg: 'eyeRelax', target: '20-20-20 法则', steps: ['看向约 6 米外的地方，保持 20 秒，边看边眨眼放松。'], caution: '眼睛干涩明显时先闭眼休息。' }
    ]
  },
  {
    id: 'waistback',
    name: '腰背放松',
    sub: '久坐腰酸 · 温和活动脊柱与髋',
    icon: '🪑',
    cls: 'l',
    minutes: 9,
    cat: 'posture', tags: ['腰背', '久坐', '低强度'],
    items: [
      { name: '猫牛式（坐姿版）', dur: 90, svg: 'catCow', target: '8 次', steps: ['坐在椅子前半，双手扶膝。', '吸气时胸口打开、腰背微凹；呼气时含胸弓背。', '动作小而慢，跟着呼吸来。'], caution: '不追求幅度；腰部疼痛加重立即停止。' },
      { name: '臀桥（温和）', dur: 90, svg: 'bridge', target: '10 次 × 2 组', steps: ['仰卧屈膝，双脚踩地。', '用臀部发力把髋慢慢抬高，停 2 秒再落下。'], caution: '脖子和腰不要用力顶；做不到就小幅抬。' },
      { name: '体侧伸展', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['一手举过头，身体向对侧慢慢侧弯，停 20 秒换边。'], caution: '只侧屈，不转头、不后仰。' },
      { name: '靠墙站立', dur: 120, svg: 'shoulderSqueeze', target: '2 分钟', steps: ['后脑、肩、臀、脚跟尽量贴墙，收紧腹部，正常呼吸。'], caution: '后脑贴墙不舒服就不要勉强，保持颈部自然中立位即可。' },
      { name: '深呼吸收尾', dur: 60, svg: 'breath', target: '6 次', steps: ['鼻吸 4 秒、口呼 6 秒，手放肚子上感受起伏。'], caution: '呼气比吸气长；头晕就放慢。' }
    ]
  },
  {
    id: 'knee',
    name: '膝关节友好',
    sub: '坐姿为主 · 不深蹲、不负重',
    icon: '🦿',
    cls: 'l',
    minutes: 8,
    cat: 'part', tags: ['膝盖', '坐姿', '低冲击'],
    items: [
      { name: '坐姿伸膝', dur: 90, svg: 'kneeExtend', target: '每侧 12 次 × 2 组', steps: ['坐直，一条腿慢慢伸直，停 2 秒，再慢慢放下。'], caution: '不锁死膝关节，不甩腿。' },
      { name: '坐姿踝泵', dur: 90, svg: 'anklePump', target: '15 次 × 3 组', steps: ['脚尖慢慢上勾停 2 秒，再向下踩停 2 秒。'], caution: '在舒服范围内做，不要追求幅度。' },
      { name: '坐姿提踵', dur: 90, svg: 'heelRaise', target: '12 次 × 2 组', steps: ['双脚踩地，脚跟缓慢抬起停 1 秒再放下。'], caution: '不屏气；疼痛明显就减少次数或停止。' },
      { name: '坐姿蹬车', dur: 90, svg: 'bicycle', target: '1 分钟 × 2 组', steps: ['坐稳，双腿像蹬自行车一样缓慢交替画圈。'], caution: '动作慢、幅度小；膝盖不适就减小圈。' },
      { name: '小腿抖动放松', dur: 60, svg: 'legShake', target: '1 分钟', steps: ['坐姿轻抬腿，轻轻抖动小腿放松 1 分钟。'], caution: '一侧小腿突然肿痛、发热或皮肤变色时不要做，并尽快就医。' }
    ]
  },
  {
    id: 'sleep',
    name: '睡前放松',
    sub: '把身体慢慢放下来，睡前做一遍',
    icon: '🌙',
    cls: 'w',
    minutes: 8,
    cat: 'scene', tags: ['睡前', '放松', '助眠'],
    items: [
      { name: '深呼吸', dur: 90, svg: 'breath', target: '8 次', steps: ['躺或坐，鼻吸 4 秒、口呼 6 秒，肩膀放松。'], caution: '呼气比吸气长；头晕就放慢。' },
      { name: '肩绕环', dur: 45, svg: 'shoulderRoll', target: '10 次 × 2 组', steps: ['两肩向后慢慢画圈，一圈约 3 秒。'], caution: '脖子放松不动。' },
      { name: '体侧伸展', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['手臂过头向对侧慢慢侧弯，停 20 秒换边。'], caution: '不转头、不后仰。' },
      { name: '坐姿脚踝画圈', dur: 60, svg: 'ankleCircle', target: '每侧各方向 8 圈', steps: ['单脚轻轻抬起，以脚踝为轴缓慢画小圈，换方向与另一侧。'], caution: '动作小而慢；抽筋或疼痛就停止。' },
      { name: '搓手熨目', dur: 60, svg: 'palmEyes', target: '1 分钟', steps: ['两手搓热，轻扣双眼停留 30 秒，同时慢慢呼吸。'], caution: '手要干净，不要压眼球。' }
    ]
  },
  {
    id: 'strength',
    name: '居家轻力量',
    sub: '自重或矿泉水瓶 · 维持肌肉，不憋气',
    icon: '💪',
    cls: 'w',
    minutes: 10,
    cat: 'quick', tags: ['轻力量', '维持肌肉', '无器械'],
    items: [
      { name: '坐站转换', dur: 120, svg: 'sitStand', target: '10 次 × 2 组', steps: ['坐在靠墙、无轮的椅子上，用腿的力量站起，再慢慢坐下。'], caution: '椅子要靠墙、不能带轮子；全程正常呼吸，绝不憋气。' },
      { name: '双手托天', dur: 60, svg: 'raiseArms', target: '8 次', steps: ['掌心向上慢慢托起，停 2 秒后从两侧落下。'], caution: '不仰头，眼睛始终平视前方。' },
      { name: '单臂上举', dur: 60, svg: 'oneArmUp', target: '左右各 8 次', steps: ['一手向上举起，另一手向下按对拉，停 2 秒换边。'], caution: '不转头、不侧屈，只是手臂上下对拉。' },
      { name: '臀桥（温和）', dur: 90, svg: 'bridge', target: '10 次 × 2 组', steps: ['仰卧屈膝，臀部发力把髋慢慢抬高，停 2 秒再放下。'], caution: '脖子和腰不要顶；做不到就小幅抬。' },
      { name: '扶稳提踵', dur: 90, svg: 'heelRaise', target: '12 次 × 2 组', steps: ['双手扶稳，脚跟慢慢抬起停 2 秒再落下。'], caution: '一定要扶稳；站不稳就改成坐姿抬脚跟。' }
    ]
  },
  {
    id: 'kneecare',
    name: '膝关节养护',
    sub: '坐姿为主 · 不逞强、不疼痛',
    icon: '🦵',
    cls: 'l',
    minutes: 8,
    cat: 'part', tags: ['膝盖', '无器械', '低强度', '腿部'],

    items: [
      { name: '坐姿伸膝', dur: 90, svg: 'kneeExtend', target: '每侧 12 次 × 2 组', steps: ['坐稳，一条腿慢慢伸直，停 2 秒，再慢慢放下。'], caution: '不锁死膝关节，不甩腿；膝盖不适就减小幅度。' },
      { name: '卧位抬腿画圈', dur: 90, svg: 'bicycle', target: '1 分钟 × 2 组', steps: ['坐稳，双腿像蹬自行车一样缓慢交替画圈。'], caution: '动作慢、幅度小；膝盖不适就减小圈。' },
      { name: '扶椅微蹲', dur: 90, svg: 'balance', target: '10 次 × 2 组', steps: ['双手扶稳椅背，膝盖微屈到舒服角度，停 2 秒再站直。'], caution: '不蹲太低、不憋气；站不稳就只做扶椅站立。' },
      { name: '坐姿提踵', dur: 90, svg: 'heelRaise', target: '12 次 × 2 组', steps: ['坐稳，前脚掌不动，双脚跟缓慢抬起停 1 秒再放下。'], caution: '疼痛明显时减少次数或停止。' }
    ]
  },
  {
    id: 'sitrelax',
    name: '久坐舒缓',
    sub: '坐着就能做 · 肩颈与脚踝',
    icon: '💺',
    cls: 'w',
    minutes: 6,
    cat: 'posture', tags: ['久坐', '肩颈', '踝泵', '低强度'],

    items: [
      { name: '坐姿扩胸', dur: 60, svg: 'chestStretch', target: '10 秒 × 4 次', steps: ['坐稳，双肩轻向后下方打开，胸口舒展到舒服即可。'], caution: '肩膀下沉，不憋气。' },
      { name: '肩胛后缩', dur: 60, svg: 'shoulderSqueeze', target: '10 次 × 2 组', steps: ['两臂自然下垂，肩胛骨往中间夹，停 3 秒松开。'], caution: '不耸肩，脖子放松。' },
      { name: '颈部温热', dur: 180, svg: 'hotpack', target: '3 分钟', steps: ['用 40~45℃ 热毛巾敷后颈与肩膀，温热舒服为准。'], caution: '皮肤感觉迟钝先用手腕内侧试温，避免烫伤；只热敷、不转动脖子。' },
      { name: '坐姿踝泵', dur: 120, svg: 'anklePump', target: '15 次 × 3 组', steps: ['坐稳，脚尖慢慢上勾再下踩，在舒服范围反复。'], caution: '不追求幅度；一侧小腿突发肿痛、发热或变色，不要做并尽快就医。' }
    ]
  },
  {
    id: 'breathe',
    name: '呼吸与放松',
    sub: '几分钟把神经慢下来',
    icon: '🌬️',
    cls: 'w',
    minutes: 5,
    cat: 'quick', tags: ['呼吸', '放松', '助眠', '低强度'],

    items: [
      { name: '腹式呼吸', dur: 120, svg: 'breath', target: '10 次', steps: ['一手放肚子，鼻吸 4 秒肚子鼓起，口呼 6 秒肚子收回。'], caution: '呼气比吸气长；头晕就放慢。' },
      { name: '4-7-8 呼吸', dur: 120, svg: 'breath', target: '6 轮', steps: ['吸气 4 秒 → 屏气 7 秒 → 呼气 8 秒，做 6 轮。'], caution: '屏气不适就缩短或跳过，不勉强。' },
      { name: '肩绕环', dur: 45, svg: 'shoulderRoll', target: '10 次 × 2 组', steps: ['两肩向后慢慢画圈，一圈约 3 秒。'], caution: '脖子放松不动。' },
      { name: '搓手熨目', dur: 60, svg: 'palmEyes', target: '1 分钟', steps: ['两手搓热，轻扣双眼停留 30 秒，慢慢呼吸。'], caution: '手要干净，不要压眼球。' }
    ]
  },
  {
    id: 'balancecare',
    name: '平衡防跌倒',
    sub: '扶稳再练 · 反复眩晕者需有人陪同',
    icon: '⚖️',
    cls: 'w',
    minutes: 8,
    cat: 'balance', tags: ['平衡', '防跌倒', '扶稳', '低强度'],

    items: [
      { name: '扶椅单脚站', dur: 60, svg: 'balance', target: '每侧 20 秒 × 2 组', steps: ['一手扶稳椅背，一条腿轻轻抬起 2~3 厘米，保持 20 秒换边。'], caution: '必须有扶的东西；头晕、站不稳立刻停下。' },
      { name: '脚跟脚尖走', dur: 60, svg: 'walk', target: '15 秒 × 2 组', steps: ['沿一条直线，脚跟碰脚尖慢慢向前走。'], caution: '有人陪同或扶墙；眩晕明显不做。' },
      { name: '坐站转换', dur: 90, svg: 'sitStand', target: '10 次 × 2 组', steps: ['坐无轮靠墙椅，用腿力站起再慢慢坐下。'], caution: '椅子靠墙不滑动；全程正常呼吸不憋气。' },
      { name: '原地踏步', dur: 120, svg: 'march', target: '1 分钟', steps: ['原地慢踏步，手臂自然摆动，抬头平视。'], caution: '速度以能正常说话为准。' }
    ]
  },
  {
    id: 'nightstretch',
    name: '睡前舒展',
    sub: '把身体慢慢放下来',
    icon: '🌙',
    cls: 'w',
    minutes: 7,
    cat: 'scene', tags: ['睡前', '拉伸', '放松', '助眠'],

    items: [
      { name: '体侧伸展', dur: 60, svg: 'sideStretch', target: '每侧 20 秒', steps: ['手臂过头向对侧慢慢侧弯，停 20 秒换边。'], caution: '不转头、不后仰。' },
      { name: '靠墙抬腿', dur: 240, svg: 'legsUpWall', target: '3 分钟', steps: ['臀部靠墙，双腿贴墙竖起，全身放松慢慢呼吸。'], caution: '腿麻、腰痛、头晕立刻放下。' },
      { name: '小腿抖动放松', dur: 60, svg: 'legShake', target: '1 分钟', steps: ['坐姿轻抬腿，轻轻抖动小腿放松 1 分钟。'], caution: '一侧小腿突发肿痛、发热或变色不要做，尽快就医。' },
      { name: '搓手熨目', dur: 60, svg: 'palmEyes', target: '1 分钟', steps: ['两手搓热，轻扣双眼停留 30 秒，慢慢呼吸。'], caution: '手要干净，不要压眼球。' }
    ]
  }
];

/* 养护课程：在已复核的温和范围内开放更多，覆盖颈肩、腿部、膝盖、全身、晨起、饭后、体态、久坐、平衡。 */
EX.courses = EX.courses.filter(c => ['neck', 'leg', 'knee', 'whole', 'activate', 'strength', 'morning', 'aftermeal', 'sleep', 'posture', 'office', 'waistback', 'balance', 'kneecare', 'sitrelax', 'breathe', 'balancecare', 'nightstretch'].includes(c.id));

/* 课程分类 */
EX.cats = [
  { id: 'all', name: '全部' },
  { id: 'part', name: '颈肩与腿部' },
  { id: 'quick', name: '全身激活' },
  { id: 'scene', name: '晨起·饭后·睡前' },
  { id: 'posture', name: '体态·久坐' },
  { id: 'balance', name: '平衡防跌倒' }
];

/* 动作库（可单独练习） */
EX.libraryNote = '下面每个动作都可以单独点开练习，做之前先看清楚"注意"那一栏。';

/* 日常提醒 */
EX.reminders = [
  { id: 'med', ico: '💊', name: '服甲状腺素', desc: '空腹服，30~60 分钟后再吃饭' },
  { id: 'water', ico: '💧', name: '喝水', desc: '今天 6~8 杯，分次小口' },
  { id: 'move', ico: '🚶', name: '起身活动', desc: '每 40 分钟走一走、勾勾脚' },
  { id: 'legup', ico: '🦵', name: '抬腿放松', desc: '把腿垫高 10 分钟' },
  { id: 'neck', ico: '🧣', name: '肩背放松', desc: '无头晕时做 5 分钟' },
  { id: 'leg', ico: '💚', name: '腿部活动', desc: '无突发肿痛时做 10 分钟' },
  { id: 'walk', ico: '👟', name: '散步', desc: '累计 30 分钟' },
  { id: 'sleep', ico: '😴', name: '早睡', desc: '睡前不刷手机，枕头高度合适' }
];

/* 短时走动：与首页「短时走动」打卡联动的跟练内容（平地慢走，不做跑跳） */
EX.walkSession = {
  id: 'walk', name: '短时走动（平地慢走）', minutes: 10, cls: 'w',
  items: [
    { name: '出门前准备', dur: 60, svg: 'walk', target: '1 分钟',
      steps: ['穿合脚、防滑的鞋，衣服宽松。', '选平整、明亮、无障碍物的路线；随身带水。', '把手机放在口袋，起步前先站稳。'],
      caution: '腿痛明显、胸闷气短或头晕时，今天就不要走，先休息并告知家人。' },
    { name: '慢速起步', dur: 180, svg: 'walk', target: '3 分钟',
      steps: ['抬头平视，肩膀放松，手臂自然摆动。', '用比平时稍慢的速度走，以能正常说话为准。', '脚跟先着地，再过渡到脚掌。'],
      caution: '不要憋气、不要追赶速度；路面湿滑就改成原地踏步。' },
    { name: '匀速行走', dur: 300, svg: 'walk', target: '5 分钟',
      steps: ['保持舒服的节奏，呼吸均匀。', '如果小腿发酸，就放慢或停下休息。', '分次完成也可以：早中晚各走几分钟，累计即可。'],
      caution: '出现胸痛、气短、头晕、腿部疼痛加重时立即停下休息；症状不缓解请及时就医。' },
    { name: '放松收尾', dur: 60, svg: 'breath', target: '1 分钟',
      steps: ['放慢脚步走一会儿再停下。', '坐着抬腿放松，脚踝慢慢画圈。', '喝几口温水，记录今天走了多久。'],
      caution: '弹力袜只穿医生确认的压力等级和尺寸，不要自行加压。' }
  ]
};
