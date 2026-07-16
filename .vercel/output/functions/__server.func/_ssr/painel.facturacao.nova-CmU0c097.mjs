import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./supabase-BvP6lAhv.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useAuth } from "./use-auth-DqYihmFD.mjs";
import { D as Plus, F as Mail, J as FileText, R as LoaderCircle, ct as CircleCheck, n as X, ot as CirclePlus, p as Trash2, s as UserPlus, w as Save } from "../_libs/lucide-react.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Topbar } from "./topbar-DkK51Kb4.mjs";
import { t as MT } from "./format-CcCWHv7m.mjs";
import { t as ClientModal } from "./client-modal-CnjiXE4R.mjs";
import { t as StampGenerator } from "./stamp-generator-Dz8nj340.mjs";
import { t as require_dom_to_image_more_min } from "../_libs/dom-to-image-more.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/painel.facturacao.nova-CmU0c097.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_dom_to_image_more_min = /* @__PURE__ */ __toESM(require_dom_to_image_more_min());
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var DOCUMENT_TYPE_LABELS = {
	VD: "Venda a Dinheiro",
	FT: "Fatura",
	RC: "Recibo",
	NC: "Nota de Crédito",
	ND: "Nota de Débito",
	CT: "Cotação",
	GR: "Guia de Remessa"
};
function DocumentPreview({ company, client, documentData, items, calculations, hasIva = true, ivaRate, hasIspc = false, ispcRate = 3 }) {
	const primaryColor = company?.primary_color || "#02664D";
	const docTypeName = DOCUMENT_TYPE_LABELS[documentData.type] || "Documento";
	const showFinancials = documentData.type !== "GR";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "pdf-content",
		className: "w-[794px] min-h-[1123px] bg-white relative overflow-hidden text-[13px] text-gray-800 shadow-2xl border border-gray-100",
		style: { fontFamily: "'Times New Roman', Times, serif" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute top-0 left-0 w-full h-40 overflow-hidden pointer-events-none z-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
				viewBox: "0 0 800 200",
				className: "w-full h-full",
				preserveAspectRatio: "none",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0,0 L800,0 L800,120 C500,20 300,160 0,60 Z",
						fill: primaryColor,
						fillOpacity: "0.05"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0,0 L800,0 L800,80 C600,0 400,120 0,30 Z",
						fill: primaryColor,
						fillOpacity: "0.1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
						d: "M0,0 L800,0 L800,40 C500,-10 300,70 0,10 Z",
						fill: primaryColor
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 p-10 flex flex-col min-h-[1123px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-start mb-8 z-10 relative px-4 mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col max-w-[55%] break-words",
						children: [
							company?.logo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: company.logo_url,
								alt: company?.name,
								className: "h-20 mb-4 object-contain max-w-full"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-16 w-16 rounded-xl flex items-center justify-center font-bold text-white text-2xl mb-4 shadow-sm",
								style: { backgroundColor: primaryColor },
								children: company?.name?.charAt(0) || "L"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-extrabold text-lg tracking-tight text-gray-900",
								children: company?.name || "Sua Empresa, Lda"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-500",
								children: company?.address || "Endereço da Empresa"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-gray-500 mt-1 flex-wrap",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-700",
											children: "NUIT:"
										}),
										" ",
										company?.nuit || "000000000"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gray-300 hidden sm:inline",
										children: "|"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: company?.phone || "Tel: +258 000 000 000" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-500",
								children: company?.email || "email@empresa.com"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right flex flex-col items-end max-w-[40%]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl font-black uppercase tracking-widest mb-2 text-right break-words w-full",
							style: {
								color: primaryColor,
								lineHeight: "1.2"
							},
							children: docTypeName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 mt-2 text-right min-w-[200px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between mb-1 gap-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500 font-medium",
									children: "Nº Doc:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gray-900",
									children: documentData.number || "Em proc..."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-gray-500 font-medium",
									children: "Data:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gray-900",
									children: documentData.date
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-stretch mb-8 gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 rounded-xl p-5 border-l-4 bg-gray-50/80",
							style: { borderLeftColor: primaryColor },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2",
									children: "Faturado A"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-bold text-base text-gray-900 mb-1",
									children: client?.name || "Nome do Cliente"
								}),
								client?.company_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-700 font-medium text-sm mb-1",
									children: client.company_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-gray-500 mb-1",
									children: client?.address || "Endereço do Cliente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-gray-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "NUIT:"
										}),
										" ",
										client?.nuit || "—"
									]
								})
							]
						}),
						[
							"RC",
							"NC",
							"ND"
						].includes(documentData.type) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 rounded-xl p-5 border border-gray-100 bg-white shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2",
									children: "Referência Original"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mb-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Documento:"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-900",
											children: documentData.reference_invoice || "—"
										})
									]
								}),
								documentData.reference_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mb-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Data:"
										}),
										" ",
										documentData.reference_date
									]
								}),
								documentData.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-gray-600",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Motivo:"
										}),
										" ",
										documentData.reason
									]
								})
							]
						}),
						documentData.type === "GR" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 rounded-xl p-5 border border-gray-100 bg-white shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2",
								children: "Detalhes de Transporte"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-x-4 gap-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Origem:"
										}),
										" ",
										documentData.origin || "—"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Destino:"
										}),
										" ",
										documentData.destination || "—"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Motorista:"
										}),
										" ",
										documentData.driver || "—"
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-gray-500 font-medium",
											children: "Matrícula:"
										}),
										" ",
										documentData.vehicle_plate || "—"
									] })
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-grow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg overflow-hidden border border-gray-200",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left border-collapse",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								style: { backgroundColor: primaryColor },
								className: "text-white",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 font-semibold text-[11px] uppercase tracking-wider w-12 text-center",
										children: "#"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 font-semibold text-[11px] uppercase tracking-wider",
										children: "Descrição do Artigo/Serviço"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-center w-20",
										children: "Qtd."
									}),
									showFinancials && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right w-28",
											children: "P. Unit."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right w-24",
											children: "Desc."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "py-3 px-4 font-semibold text-[11px] uppercase tracking-wider text-right w-32",
											children: "Total"
										})
									] })
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "bg-white",
								children: [items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: showFinancials ? 6 : 3,
									className: "py-8 text-center text-gray-400 italic",
									children: "Sem itens"
								}) }), items.map((item, index) => {
									const qty = parseFloat(item.quantity) || 0;
									const price = parseFloat(item.unit_price) || 0;
									const lineGross = qty * price;
									const discountVal = parseFloat(item.discount_value) || 0;
									const lineDiscount = item.discount_type === "percentagem" ? lineGross * (discountVal / 100) : discountVal;
									const lineTotal = lineGross - lineDiscount;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `border-b border-gray-100 ${index % 2 !== 0 ? "bg-gray-50/50" : ""}`,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-center text-gray-500",
												children: index + 1
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 font-medium text-gray-800",
												children: item.description || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-gray-300 italic",
													children: "Item sem descrição..."
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-center",
												children: qty
											}),
											showFinancials && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 px-4 text-right text-gray-600",
													children: MT(price)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 px-4 text-right text-gray-500",
													children: lineDiscount > 0 ? `-${MT(lineDiscount)}` : "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "py-3 px-4 text-right font-semibold text-gray-900",
													children: MT(lineTotal)
												})
											] })
										]
									}, item.id || index);
								})]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row justify-between items-start mt-6 gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100 min-h-[100px] w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2",
								children: "Observações / Termos"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-gray-600 text-xs whitespace-pre-wrap leading-relaxed",
								children: documentData.observations || "Obrigado pela sua preferência."
							})]
						}), showFinancials && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full md:w-[320px] shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-gray-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-900",
											children: MT(calculations.subtotal)
										})]
									}),
									calculations.totalDiscount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-red-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Desconto Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold",
											children: ["-", MT(calculations.totalDiscount)]
										})]
									}),
									hasIva && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-gray-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"IVA (",
											ivaRate,
											"%)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-900",
											children: MT(calculations.totalIva)
										})]
									}),
									hasIspc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-gray-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"ISPC (",
											ispcRate,
											"%)"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-gray-900",
											children: MT(calculations.totalIspc || 0)
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl p-4 flex justify-between items-center text-white mt-2 shadow-md",
								style: { backgroundColor: primaryColor },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold uppercase tracking-wider text-xs opacity-90",
									children: "Total a Pagar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl font-black",
									children: MT(calculations.total)
								})]
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto pt-16 relative",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-[-40px] left-[-40px] w-[calc(100%+80px)] h-32 pointer-events-none z-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
								viewBox: "0 0 800 100",
								className: "w-full h-full",
								preserveAspectRatio: "none",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M0,100 L800,100 L800,60 C500,100 300,0 0,40 Z",
									fill: primaryColor,
									fillOpacity: "0.05"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d: "M0,100 L800,100 L800,80 C600,120 400,20 0,60 Z",
									fill: primaryColor,
									fillOpacity: "0.1"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative z-10 flex justify-end items-end w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-center",
								children: company?.use_digital_stamp !== false ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-32 h-32 opacity-95 relative",
									style: {
										transform: "rotate(-3deg)",
										top: "10px"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StampGenerator, {
										companyName: company?.name || "SUA EMPRESA",
										companyNuit: company?.nuit || "000000000",
										companyCity: company?.city || "MAPUTO",
										companyPhone: company?.phone || "---",
										companyAddress: company?.address || "",
										color: primaryColor,
										style: company?.stamp_style || "style1"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-end h-32 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-48 border-b border-gray-400 border-dashed mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-gray-400 font-bold uppercase tracking-widest",
										children: "Assinatura / Carimbo"
									})]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center mt-6 relative z-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[9px] text-gray-400 uppercase tracking-widest",
								children: "Processado por software certificado • FatureAqui.com • Válido sem assinatura original devido a selo digital"
							})
						})
					]
				})
			]
		})]
	});
}
function SuccessModal({ isOpen, onClose, documentNumber, onDownload, onEmail, onNew }) {
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-3xl bg-card p-8 shadow-2xl text-center relative animate-in fade-in zoom-in duration-300",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "absolute right-4 top-4 rounded-full p-1.5 hover:bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-10 w-10" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-black text-foreground mb-2",
					children: "Sucesso!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mb-8",
					children: [
						"O documento ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: documentNumber
						}),
						" foi emitido e guardado com sucesso."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onDownload,
							className: "w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-95 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Baixar PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onEmail,
							className: "w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground hover:bg-muted transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), " Enviar por Email"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onNew,
							className: "w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary-soft text-primary px-4 text-sm font-semibold hover:bg-primary-soft/80 transition",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CirclePlus, { className: "h-4 w-4" }), " Criar Novo"]
						})
					]
				})
			]
		})
	});
}
function NovaFacturaPage() {
	const { user } = useAuth();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [isClientModalOpen, setIsClientModalOpen] = (0, import_react.useState)(false);
	const [isSuccessModalOpen, setIsSuccessModalOpen] = (0, import_react.useState)(false);
	const [lastGeneratedNumber, setLastGeneratedNumber] = (0, import_react.useState)("");
	const [docType, setDocType] = (0, import_react.useState)("FT");
	const [clientId, setClientId] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [observations, setObservations] = (0, import_react.useState)("");
	const [referenceInvoice, setReferenceInvoice] = (0, import_react.useState)("");
	const [referenceDate, setReferenceDate] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [origin, setOrigin] = (0, import_react.useState)("");
	const [destination, setDestination] = (0, import_react.useState)("");
	const [driver, setDriver] = (0, import_react.useState)("");
	const [vehiclePlate, setVehiclePlate] = (0, import_react.useState)("");
	const [ocasionalClient, setOcasionalClient] = (0, import_react.useState)({
		name: "",
		nuit: "",
		email: "",
		phone: "",
		address: ""
	});
	const [items, setItems] = (0, import_react.useState)([{
		id: Math.random().toString(36).substring(7),
		type: "produto",
		description: "",
		quantity: "1",
		unit_price: "0",
		discount_type: "percentagem",
		discount_value: "0"
	}]);
	const [hasIva, setHasIva] = (0, import_react.useState)(true);
	const [ivaRate, setIvaRate] = (0, import_react.useState)(16);
	const [hasIspc, setHasIspc] = (0, import_react.useState)(false);
	const [ispcRate, setIspcRate] = (0, import_react.useState)(3);
	const { data: company } = useQuery({
		queryKey: ["company", user?.id],
		queryFn: async () => {
			if (!user) return null;
			const { data } = await supabase.from("companies").select("*").eq("user_id", user.id).single();
			return data;
		},
		enabled: !!user
	});
	const { data: clients = [] } = useQuery({
		queryKey: ["clients", company?.id],
		queryFn: async () => {
			if (!company) return [];
			const { data } = await supabase.from("clients").select("*").eq("company_id", company.id).order("name");
			return data || [];
		},
		enabled: !!company
	});
	const { data: pastInvoices = [] } = useQuery({
		queryKey: ["pastInvoices", company?.id],
		queryFn: async () => {
			if (!company) return [];
			const { data } = await supabase.from("documents").select("*").eq("company_id", company.id).in("type", ["FT", "VD"]).order("created_at", { ascending: false });
			return data || [];
		},
		enabled: !!company
	});
	const [nextDocNumber, setNextDocNumber] = (0, import_react.useState)("");
	const [previewScale, setPreviewScale] = (0, import_react.useState)(1);
	const previewContainerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		async function fetchNextSequence() {
			if (!company?.id) return;
			const dateObj = new Date(date);
			const yearMonthPrefix = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
			const { data: lastDoc } = await supabase.from("documents").select("sequence").eq("company_id", company.id).eq("type", docType).like("date", `${yearMonthPrefix}-%`).order("sequence", { ascending: false }).limit(1);
			const sequence = lastDoc?.[0]?.sequence ? lastDoc[0].sequence + 1 : 1;
			setNextDocNumber(`${docType} ${yearMonthPrefix}/${sequence}`);
		}
		fetchNextSequence();
	}, [
		docType,
		date,
		company?.id
	]);
	(0, import_react.useEffect)(() => {
		if (!previewContainerRef.current) return;
		const resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				const { width } = entry.contentRect;
				const scaleX = (width - 48) / 794;
				setPreviewScale(Math.min(scaleX, 1));
			}
		});
		resizeObserver.observe(previewContainerRef.current);
		return () => resizeObserver.disconnect();
	}, []);
	const selectedClient = clients.find((c) => c.id === clientId);
	const handleReferenceSelect = async (invoiceNumber) => {
		setReferenceInvoice(invoiceNumber);
		if (!invoiceNumber) {
			setReferenceDate("");
			return;
		}
		const selectedInv = pastInvoices.find((inv) => inv.number === invoiceNumber);
		if (selectedInv) {
			setReferenceDate(selectedInv.date);
			const matchedClient = clients.find((c) => c.name === selectedInv.client_name);
			if (matchedClient) setClientId(matchedClient.id);
			else {
				setClientId("ocasional");
				setOcasionalClient({
					name: selectedInv.client_name,
					nuit: selectedInv.client_nuit || "",
					email: selectedInv.client_email || "",
					phone: selectedInv.client_phone || "",
					address: selectedInv.client_address || ""
				});
			}
			if (docType === "NC" || docType === "ND") {
				const { data: pastItems } = await supabase.from("document_items").select("*").eq("document_id", selectedInv.id).order("order_index");
				if (pastItems && pastItems.length > 0) setItems(pastItems.map((item) => ({
					id: Math.random().toString(36).substring(7),
					type: item.type,
					description: item.description,
					quantity: item.quantity.toString(),
					unit_price: item.unit_price.toString(),
					discount_type: item.discount_type,
					discount_value: item.discount_value.toString()
				})));
				setHasIva(selectedInv.has_iva ?? true);
				setHasIspc(selectedInv.has_ispc ?? false);
				setIvaRate(selectedInv.iva_rate ?? 16);
				setIspcRate(selectedInv.ispc_rate ?? 3);
			}
		}
	};
	(0, import_react.useEffect)(() => {
		if (hasIspc && docType !== "VD" && docType !== "CT") setHasIspc(false);
	}, [docType, hasIspc]);
	const addItem = () => {
		setItems([...items, {
			id: Math.random().toString(36).substring(7),
			type: "produto",
			description: "",
			quantity: "1",
			unit_price: "0",
			discount_type: "percentagem",
			discount_value: "0"
		}]);
	};
	const removeItem = (id) => {
		if (items.length === 1) return;
		setItems(items.filter((item) => item.id !== id));
	};
	const updateItem = (id, field, value) => {
		setItems(items.map((item) => item.id === id ? {
			...item,
			[field]: value
		} : item));
	};
	const calculations = (0, import_react.useMemo)(() => {
		let subtotal = 0;
		let totalDiscount = 0;
		items.forEach((item) => {
			const qty = parseFloat(item.quantity) || 0;
			const price = parseFloat(item.unit_price) || 0;
			const discountVal = parseFloat(item.discount_value) || 0;
			const lineGross = qty * price;
			let lineDiscount = 0;
			if (item.discount_type === "percentagem") lineDiscount = lineGross * (discountVal / 100);
			else lineDiscount = discountVal;
			subtotal += lineGross;
			totalDiscount += lineDiscount;
		});
		const taxableBase = subtotal - totalDiscount;
		const totalIva = hasIva ? taxableBase * (ivaRate / 100) : 0;
		const totalIspc = hasIspc ? taxableBase * (ispcRate / 100) : 0;
		const total = taxableBase + totalIva + totalIspc;
		return {
			subtotal,
			totalDiscount,
			taxableBase,
			totalIva,
			totalIspc,
			total
		};
	}, [
		items,
		hasIva,
		ivaRate,
		hasIspc,
		ispcRate
	]);
	const documentData = {
		type: docType,
		date,
		reference_invoice: referenceInvoice,
		reference_date: referenceDate,
		reason,
		origin,
		destination,
		driver,
		vehicle_plate: vehiclePlate,
		observations,
		number: nextDocNumber || "A carregar..."
	};
	const saveDocument = useMutation({
		mutationFn: async () => {
			if (!company) throw new Error("Empresa não encontrada");
			let finalClient;
			if (clientId === "ocasional") {
				if (!ocasionalClient.name) throw new Error("O Nome do cliente é obrigatório");
				finalClient = ocasionalClient;
			} else {
				if (!clientId) throw new Error("Selecione um cliente");
				if (!selectedClient) throw new Error("Cliente inválido");
				finalClient = selectedClient;
			}
			if (items.some((i) => !i.description)) throw new Error("Preencha a descrição de todos os itens");
			const { data: settings } = await supabase.from("system_settings").select("*").single();
			const { data: subscription } = await supabase.from("subscriptions").select("*").eq("user_id", user?.id).single();
			if (!(subscription && (subscription.status === "ativo" || subscription.status === "active") && subscription.valid_until && new Date(subscription.valid_until) > /* @__PURE__ */ new Date())) {
				const docLimit = settings?.free_plan_docs_limit || 5;
				const date = /* @__PURE__ */ new Date();
				const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split("T")[0];
				const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split("T")[0];
				const { count } = await supabase.from("documents").select("*", {
					count: "exact",
					head: true
				}).eq("company_id", company.id).gte("date", startOfMonth).lte("date", endOfMonth);
				if (docLimit > 0 && (count || 0) >= docLimit) throw new Error(`Limite de ${docLimit} documentos gratuitos atingido. Faça Upgrade!`);
			}
			const dateObj = new Date(date);
			const year = dateObj.getFullYear();
			const yearMonthPrefix = `${year}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`;
			const { data: lastDoc } = await supabase.from("documents").select("sequence").eq("company_id", company.id).eq("type", docType).like("date", `${yearMonthPrefix}-%`).order("sequence", { ascending: false }).limit(1);
			const sequence = lastDoc?.[0]?.sequence ? lastDoc[0].sequence + 1 : 1;
			const number = `${docType} ${yearMonthPrefix}/${sequence}`;
			const { data: doc, error: docError } = await supabase.from("documents").insert({
				company_id: company.id,
				type: docType,
				number,
				sequence,
				year,
				status: "emitido",
				date,
				time: (/* @__PURE__ */ new Date()).toTimeString().split(" ")[0],
				client_name: finalClient.name,
				client_company: finalClient.company_name || null,
				client_nuit: finalClient.nuit,
				client_phone: finalClient.phone,
				client_email: finalClient.email,
				client_address: finalClient.address,
				subtotal: calculations.subtotal,
				total_discount: calculations.totalDiscount,
				total_iva: calculations.totalIva,
				total_ispc: calculations.totalIspc,
				total: calculations.total,
				observations: observations || null,
				reference_invoice: referenceInvoice || null,
				reference_date: referenceDate || null,
				reason: reason || null,
				origin: origin || null,
				destination: destination || null,
				driver: driver || null,
				vehicle_plate: vehiclePlate || null,
				has_iva: hasIva,
				has_ispc: hasIspc,
				iva_rate: hasIva ? ivaRate : 0,
				ispc_rate: hasIspc ? ispcRate : 0
			}).select().single();
			if (docError) throw docError;
			const docItems = items.map((item, index) => {
				const qty = parseFloat(item.quantity) || 0;
				const price = parseFloat(item.unit_price) || 0;
				const lineGross = qty * price;
				const discountVal = parseFloat(item.discount_value) || 0;
				const lineDiscount = item.discount_type === "percentagem" ? lineGross * (discountVal / 100) : discountVal;
				return {
					document_id: doc.id,
					type: item.type,
					description: item.description,
					quantity: qty,
					unit_price: price,
					iva_rate: hasIva ? ivaRate : 0,
					discount_type: item.discount_type,
					discount_value: discountVal,
					line_total: lineGross - lineDiscount,
					order_index: index
				};
			});
			const { error: itemsError } = await supabase.from("document_items").insert(docItems);
			if (itemsError) throw itemsError;
			return doc;
		},
		onSuccess: (data) => {
			setLastGeneratedNumber(data.number);
			setIsSuccessModalOpen(true);
			queryClient.invalidateQueries({ queryKey: ["documents"] });
		},
		onError: (error) => {
			toast.error(error.message || "Erro ao criar documento");
		}
	});
	const resetForm = () => {
		setIsSuccessModalOpen(false);
		setClientId("");
		setOcasionalClient({
			name: "",
			nuit: "",
			email: "",
			phone: "",
			address: ""
		});
		setItems([{
			id: Math.random().toString(36).substring(7),
			type: "produto",
			description: "",
			quantity: "1",
			unit_price: "0",
			discount_type: "percentagem",
			discount_value: "0"
		}]);
		setReferenceInvoice("");
		setReferenceDate("");
		setReason("");
		setOrigin("");
		setDestination("");
		setDriver("");
		setVehiclePlate("");
		setObservations("");
	};
	const isRefDoc = [
		"RC",
		"NC",
		"ND"
	].includes(docType);
	const isTransportDoc = docType === "GR";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {
				title: "Nova Factura",
				subtitle: "Preencha os detalhes e visualize o documento ao lado"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-[1600px] p-4 sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-2 gap-8 items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card p-6 shadow-soft space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 gap-6 sm:grid-cols-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
												children: "Tipo de Documento"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: docType,
												onChange: (e) => setDocType(e.target.value),
												className: "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "FT",
														children: "Factura (FT)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "VD",
														children: "Venda a Dinheiro (VD)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "RC",
														children: "Recibo (RC)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "NC",
														children: "Nota de Crédito (NC)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "ND",
														children: "Nota de Débito (ND)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "CT",
														children: "Cotação (CT)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "GR",
														children: "Guia de Remessa (GR)"
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
												children: "Data de Emissão"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												value: date,
												onChange: (e) => setDate(e.target.value),
												className: "h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
												children: "Cliente"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: clientId,
													onChange: (e) => setClientId(e.target.value),
													className: "h-11 flex-1 rounded-xl border border-border bg-background px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "",
															children: "Selecione um cliente..."
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "ocasional",
															children: "+ Digitar Manualmente (Não guardar)"
														}),
														clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
															value: c.id,
															children: [
																c.name,
																" ",
																c.nuit ? `(NUIT: ${c.nuit})` : ""
															]
														}, c.id))
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setIsClientModalOpen(true),
													className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary hover:bg-primary-soft/80 transition",
													title: "Novo Cliente",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5" })
												})]
											}),
											clientId === "ocasional" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-muted/20 p-4 rounded-xl border border-border/50",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-xs text-muted-foreground",
														children: "Nome do Cliente *"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: ocasionalClient.name,
														onChange: (e) => setOcasionalClient({
															...ocasionalClient,
															name: e.target.value
														}),
														className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-xs text-muted-foreground",
														children: "NUIT"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: ocasionalClient.nuit,
														onChange: (e) => setOcasionalClient({
															...ocasionalClient,
															nuit: e.target.value
														}),
														className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-xs text-muted-foreground",
														children: "Email"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "email",
														value: ocasionalClient.email,
														onChange: (e) => setOcasionalClient({
															...ocasionalClient,
															email: e.target.value
														}),
														className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-xs text-muted-foreground",
														children: "Endereço"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														value: ocasionalClient.address,
														onChange: (e) => setOcasionalClient({
															...ocasionalClient,
															address: e.target.value
														}),
														className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
													})] })
												]
											})
										]
									}),
									isRefDoc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-4 border border-border/50 space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase text-foreground",
											children: "Documento de Referência"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs text-muted-foreground",
													children: "Factura Original"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: referenceInvoice,
													onChange: (e) => handleReferenceSelect(e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Selecione a fatura..."
													}), pastInvoices.map((inv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
														value: inv.number,
														children: [
															inv.number,
															" - ",
															inv.client_name
														]
													}, inv.id))]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs text-muted-foreground",
													children: "Data da Factura"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "date",
													value: referenceDate,
													onChange: (e) => setReferenceDate(e.target.value),
													readOnly: true,
													className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none opacity-70"
												})] }),
												docType !== "RC" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "sm:col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-xs text-muted-foreground",
														children: "Motivo"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														placeholder: "Motivo para a emissão da nota...",
														value: reason,
														onChange: (e) => setReason(e.target.value),
														className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
													})]
												})
											]
										})]
									}),
									isTransportDoc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-muted/30 p-4 border border-border/50 space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase text-foreground",
											children: "Detalhes de Transporte"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs text-muted-foreground",
													children: "Origem"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: origin,
													onChange: (e) => setOrigin(e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs text-muted-foreground",
													children: "Destino"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: destination,
													onChange: (e) => setDestination(e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs text-muted-foreground",
													children: "Motorista"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: driver,
													onChange: (e) => setDriver(e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "text-xs text-muted-foreground",
													children: "Matrícula da Viatura"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: vehiclePlate,
													onChange: (e) => setVehiclePlate(e.target.value),
													className: "mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none"
												})] })
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card shadow-soft overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-muted/30 px-5 py-3 border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-sm",
										children: "Linhas do Documento"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-5 space-y-4",
									children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-[1fr_80px_100px_140px_40px] gap-2 items-start sm:items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												placeholder: "Descrição do produto ou serviço...",
												value: item.description,
												onChange: (e) => updateItem(item.id, "description", e.target.value),
												className: "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0.01",
												step: "0.01",
												placeholder: "Qtd.",
												value: item.quantity,
												onChange: (e) => updateItem(item.id, "quantity", e.target.value),
												className: "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
											}),
											!isTransportDoc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: "0",
												step: "0.01",
												placeholder: "Preço MT",
												value: item.unit_price,
												onChange: (e) => updateItem(item.id, "unit_price", e.target.value),
												className: "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													placeholder: "Desc.",
													value: item.discount_value,
													onChange: (e) => updateItem(item.id, "discount_value", e.target.value),
													className: "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													value: item.discount_type,
													onChange: (e) => updateItem(item.id, "discount_type", e.target.value),
													className: "h-10 rounded-lg border border-border bg-background px-1 text-sm focus:border-primary focus:outline-none",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "percentagem",
														children: "%"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "valor_fixo",
														children: "MT"
													})]
												})]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => removeItem(item.id),
												disabled: items.length === 1,
												className: "grid h-10 w-10 shrink-0 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										]
									}, item.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: addItem,
										className: "inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Adicionar linha"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: hasIva,
													onChange: (e) => setHasIva(e.target.checked),
													disabled: isTransportDoc,
													className: "rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
												}), "IVA"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: ivaRate,
												onChange: (e) => setIvaRate(Number(e.target.value)),
												disabled: !hasIva || isTransportDoc,
												className: "h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 16,
													children: "16% (Normal)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: 0,
													children: "0% (Isento)"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: hasIspc,
													onChange: (e) => setHasIspc(e.target.checked),
													disabled: isTransportDoc || docType !== "VD" && docType !== "CT",
													className: "rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
												}), "ISPC"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: ispcRate,
												onChange: (e) => setIspcRate(Number(e.target.value)),
												disabled: !hasIspc || isTransportDoc || docType !== "VD" && docType !== "CT",
												className: "h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 3,
														children: "3%"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 12,
														children: "12%"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 15,
														children: "15%"
													})
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
											children: "Observações"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											value: observations,
											onChange: (e) => setObservations(e.target.value),
											placeholder: "Notas para o cliente...",
											className: "min-h-[100px] w-full rounded-xl border border-border bg-card p-3.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4 flex flex-col justify-between",
									children: [!isTransportDoc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Subtotal"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: MT(calculations.subtotal)
												})]
											}),
											calculations.totalDiscount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm text-destructive",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Desconto Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold",
													children: ["-", MT(calculations.totalDiscount)]
												})]
											}),
											hasIva && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [
														"IVA (",
														ivaRate,
														"%)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: MT(calculations.totalIva)
												})]
											}),
											hasIspc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: [
														"ISPC (",
														ispcRate,
														"%)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold",
													children: MT(calculations.totalIspc)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border-t border-border pt-4 mt-2 flex justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold text-foreground",
													children: "Total a Pagar"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xl font-black text-primary",
													children: MT(calculations.total)
												})]
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 flex items-center justify-center text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-xl p-4",
										children: "Guias de Remessa não geram obrigações financeiras. Totais ocultos."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-4 grid grid-cols-2 gap-3 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => navigate({ to: "/painel/facturacao" }),
											className: "w-full rounded-full border border-border bg-background py-2.5 text-sm font-semibold text-foreground hover:bg-muted",
											children: "Cancelar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => saveDocument.mutate(),
											disabled: saveDocument.isPending,
											className: "inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 disabled:opacity-70",
											children: [saveDocument.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), "Emitir"]
										})]
									})]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						ref: previewContainerRef,
						className: "hidden lg:flex flex-col items-center lg:sticky lg:top-8 bg-muted/20 rounded-3xl border border-border h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full flex items-center justify-between sticky top-0 bg-muted/90 backdrop-blur-md z-10 p-6 pb-2 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-foreground",
								children: "Pré-visualização"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-semibold",
								children: "Tempo Real"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex w-full justify-center pb-8",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: `${794 * previewScale}px`,
									height: `${1123 * previewScale}px`,
									position: "relative"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										transform: `scale(${previewScale})`,
										transformOrigin: "top left",
										width: "794px",
										height: "1123px",
										position: "absolute",
										top: 0,
										left: 0
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPreview, {
										company,
										client: clientId === "ocasional" ? ocasionalClient : selectedClient,
										documentData,
										items,
										calculations,
										hasIva,
										ivaRate,
										hasIspc,
										ispcRate
									})
								})
							})
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientModal, {
				isOpen: isClientModalOpen,
				onClose: () => setIsClientModalOpen(false),
				companyId: company?.id || "",
				onClientCreated: (id) => setClientId(id)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuccessModal, {
				isOpen: isSuccessModalOpen,
				onClose: () => navigate({ to: "/painel/facturacao" }),
				documentNumber: lastGeneratedNumber,
				onDownload: () => {
					const element = document.getElementById("pdf-content");
					if (!element) return;
					toast.success("A gerar PDF... por favor aguarde.");
					import_dom_to_image_more_min.default.toPng(element, {
						quality: 1,
						bgcolor: "#ffffff",
						scale: 2
					}).then((dataUrl) => {
						const pdf = new import_jspdf_node_min.default("p", "mm", "a4");
						const pdfWidth = pdf.internal.pageSize.getWidth();
						const pdfHeight = pdf.internal.pageSize.getHeight();
						pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
						pdf.save(`${lastGeneratedNumber.replace(/\//g, "-")}.pdf`);
						toast.success("Download concluído!");
					}).catch((error) => {
						console.error("Erro ao gerar PDF:", error);
						toast.error("Erro ao gerar PDF.");
					});
				},
				onEmail: () => toast.success("Email enviado com sucesso!"),
				onNew: resetForm
			})
		]
	});
}
//#endregion
export { NovaFacturaPage as component };
