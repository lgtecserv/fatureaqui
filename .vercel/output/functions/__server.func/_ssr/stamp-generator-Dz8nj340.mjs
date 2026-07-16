import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function StampGenerator({ companyName = "EMPRESA DESCONHECIDA", companyNuit = "000000000", companyCity = "MAPUTO", companyPhone = "---", companyAddress = "---", color = "#02664D", style = "style1", className = "" }) {
	const upperName = (companyName.length > 25 ? companyName.substring(0, 22) + "..." : companyName).toUpperCase();
	const nuitText = `NUIT: ${companyNuit}`;
	const words = companyName.split(" ").filter((w) => w.trim().length > 0);
	const initials = words.length > 1 ? (words[0][0] + words[words.length - 1][0]).toUpperCase() : companyName.substring(0, 2).toUpperCase();
	let locationText = (companyCity || "MOÇAMBIQUE").toUpperCase();
	if (locationText.length > 15) locationText = locationText.substring(0, 15);
	let addressText = companyAddress || "";
	if (addressText.length > 30) addressText = addressText.substring(0, 27) + "...";
	const idPrefix = Math.random().toString(36).substr(2, 9);
	const pathIdTop = `curve-top-${idPrefix}`;
	const pathIdBottom = `curve-bottom-${idPrefix}`;
	if (style === "style4") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 120",
		className,
		style: {
			width: "100%",
			height: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "10",
				width: "190",
				height: "100",
				fill: "none",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "35",
				fill: color,
				fontSize: "12",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "0.5",
				children: upperName.length > 25 ? upperName.substring(0, 25) : upperName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "55",
				fill: color,
				fontSize: "12",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "1",
				children: nuitText
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: "100",
				y: "75",
				fill: color,
				fontSize: "11",
				fontWeight: "bold",
				textAnchor: "middle",
				children: ["Cel: ", companyPhone]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "95",
				fill: color,
				fontSize: "11",
				fontWeight: "bold",
				textAnchor: "middle",
				children: addressText
			})
		]
	});
	if (style === "style5") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 120",
		className,
		style: {
			width: "100%",
			height: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "5",
				y: "10",
				width: "190",
				height: "100",
				fill: "none",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "70",
				y: "20",
				width: "60",
				height: "50",
				fill: color
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "58",
				fill: "white",
				fontSize: "36",
				fontWeight: "900",
				textAnchor: "middle",
				letterSpacing: "2",
				children: initials
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "90",
				fill: color,
				fontSize: "11",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "0.5",
				children: upperName.length > 28 ? upperName.substring(0, 28) : upperName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: "100",
				y: "105",
				fill: color,
				fontSize: "9",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "1",
				children: [
					nuitText,
					" - ",
					locationText
				]
			})
		]
	});
	if (style === "style2") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 200",
		className,
		style: {
			width: "100%",
			height: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				id: pathIdTop,
				d: "M 40,100 A 60,60 0 0,1 160,100",
				fill: "transparent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				id: pathIdBottom,
				d: "M 160,100 A 60,60 0 0,1 40,100",
				fill: "transparent"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "90",
				fill: "none",
				stroke: color,
				strokeWidth: "8",
				strokeDasharray: "12,8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "82",
				fill: "none",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "76",
				fill: "none",
				stroke: color,
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "45",
				fill: "none",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "40",
				fill: "none",
				stroke: color,
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				fill: color,
				fontSize: "14",
				fontWeight: "bold",
				letterSpacing: "1.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("textPath", {
					href: `#${pathIdTop}`,
					startOffset: "50%",
					textAnchor: "middle",
					children: [
						"★ ",
						upperName,
						" ★"
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				fill: color,
				fontSize: "14",
				fontWeight: "bold",
				letterSpacing: "2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textPath", {
					href: `#${pathIdBottom}`,
					startOffset: "50%",
					textAnchor: "middle",
					children: nuitText
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "100",
				fill: color,
				fontSize: "16",
				fontWeight: "900",
				textAnchor: "middle",
				dominantBaseline: "middle",
				letterSpacing: "1",
				children: locationText
			})
		]
	});
	if (style === "style3") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 200",
		className,
		style: {
			width: "100%",
			height: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "100,10 180,55 180,145 100,190 20,145 20,55",
				fill: "none",
				stroke: color,
				strokeWidth: "5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "100,18 173,60 173,140 100,182 27,140 27,60",
				fill: "none",
				stroke: color,
				strokeWidth: "2",
				strokeDasharray: "6,4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "30",
				y1: "70",
				x2: "170",
				y2: "70",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "30",
				y1: "130",
				x2: "170",
				y2: "130",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "55",
				fill: color,
				fontSize: "12",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "2",
				children: "VALIDADO"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "95",
				fill: color,
				fontSize: "15",
				fontWeight: "900",
				textAnchor: "middle",
				letterSpacing: "1",
				children: upperName
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "115",
				fill: color,
				fontSize: "13",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "2",
				children: nuitText
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: "100",
				y: "155",
				fill: color,
				fontSize: "14",
				fontWeight: "bold",
				textAnchor: "middle",
				letterSpacing: "1",
				children: [
					"★ ",
					locationText,
					" ★"
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 200 200",
		className,
		style: {
			width: "100%",
			height: "100%"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				id: pathIdTop,
				d: "M 30,100 A 70,70 0 0,1 170,100",
				fill: "transparent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				id: pathIdBottom,
				d: "M 170,100 A 70,70 0 0,1 30,100",
				fill: "transparent"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "92",
				fill: "none",
				stroke: color,
				strokeWidth: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "86",
				fill: "none",
				stroke: color,
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "50",
				fill: "none",
				stroke: color,
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "100",
				cy: "100",
				r: "46",
				fill: "none",
				stroke: color,
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				fill: color,
				fontSize: "16",
				fontWeight: "bold",
				letterSpacing: "1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textPath", {
					href: `#${pathIdTop}`,
					startOffset: "50%",
					textAnchor: "middle",
					children: upperName
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				fill: color,
				fontSize: "16",
				fontWeight: "bold",
				letterSpacing: "2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textPath", {
					href: `#${pathIdBottom}`,
					startOffset: "50%",
					textAnchor: "middle",
					children: nuitText
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "100",
				y: "100",
				fill: color,
				fontSize: "16",
				fontWeight: "900",
				textAnchor: "middle",
				dominantBaseline: "middle",
				letterSpacing: "1",
				children: locationText
			})
		]
	});
}
//#endregion
export { StampGenerator as t };
