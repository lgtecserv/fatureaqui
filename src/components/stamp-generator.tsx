import React from "react";

interface StampGeneratorProps {
  companyName: string;
  companyNuit: string;
  companyCity?: string;
  companyPhone?: string;
  companyAddress?: string;
  color?: string;
  style?: "style1" | "style2" | "style3" | "style4" | "style5";
  className?: string;
}

export function StampGenerator({ 
  companyName = "EMPRESA DESCONHECIDA", 
  companyNuit = "000000000", 
  companyCity = "MAPUTO",
  companyPhone = "---",
  companyAddress = "---",
  color = "#02664D", 
  style = "style1",
  className = ""
}: StampGeneratorProps) {
  
  // Limitar o tamanho do nome para não quebrar o carimbo
  const shortName = companyName.length > 25 ? companyName.substring(0, 22) + "..." : companyName;
  const upperName = shortName.toUpperCase();
  const nuitText = `NUIT: ${companyNuit}`;
  
  // Iniciais para o estilo 5
  const words = companyName.split(" ").filter(w => w.trim().length > 0);
  const initials = words.length > 1 
    ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
    : companyName.substring(0, 2).toUpperCase();

  // Tratamento da localização
  let locationText = (companyCity || "MOÇAMBIQUE").toUpperCase();
  if (locationText.length > 15) locationText = locationText.substring(0, 15);

  // Tratamento do endereço
  let addressText = companyAddress || "";
  if (addressText.length > 30) addressText = addressText.substring(0, 27) + "...";

  // ID único para os paths do SVG, importante para evitar conflitos se houver vários na página
  const idPrefix = Math.random().toString(36).substr(2, 9);
  const pathIdTop = `curve-top-${idPrefix}`;
  const pathIdBottom = `curve-bottom-${idPrefix}`;

  if (style === "style4") {
    // Estilo Retangular Clássico (Lanchinho do Bairro)
    return (
      <svg viewBox="0 0 200 120" className={className} style={{ width: "100%", height: "100%" }}>
        {/* Borda retangular dupla */}
        <rect x="5" y="10" width="190" height="100" fill="none" stroke={color} strokeWidth="2" />
        
        {/* Textos empilhados */}
        <text x="100" y="35" fill={color} fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
          {upperName.length > 25 ? upperName.substring(0, 25) : upperName}
        </text>
        <text x="100" y="55" fill={color} fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="1">
          {nuitText}
        </text>
        <text x="100" y="75" fill={color} fontSize="11" fontWeight="bold" textAnchor="middle">
          Cel: {companyPhone}
        </text>
        <text x="100" y="95" fill={color} fontSize="11" fontWeight="bold" textAnchor="middle">
          {addressText}
        </text>
      </svg>
    );
  }

  if (style === "style5") {
    // Estilo Retangular com Iniciais Iniciais (Selo MB)
    return (
      <svg viewBox="0 0 200 120" className={className} style={{ width: "100%", height: "100%" }}>
        {/* Borda retangular */}
        <rect x="5" y="10" width="190" height="100" fill="none" stroke={color} strokeWidth="2" />
        
        {/* Bloco do Logo Iniciais (Quadrado Invertido) */}
        <rect x="70" y="20" width="60" height="50" fill={color} />
        <text x="100" y="58" fill="white" fontSize="36" fontWeight="900" textAnchor="middle" letterSpacing="2">
          {initials}
        </text>
        
        {/* Textos */}
        <text x="100" y="90" fill={color} fontSize="11" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
          {upperName.length > 28 ? upperName.substring(0, 28) : upperName}
        </text>
        <text x="100" y="105" fill={color} fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">
          {nuitText} - {locationText}
        </text>
      </svg>
    );
  }

  if (style === "style2") {
    // Estilo Selo / Certificado (serrilhado simulação com dashed e múltiplos anéis)
    return (
      <svg viewBox="0 0 200 200" className={className} style={{ width: "100%", height: "100%" }}>
        <defs>
          <path id={pathIdTop} d="M 40,100 A 60,60 0 0,1 160,100" fill="transparent" />
          <path id={pathIdBottom} d="M 160,100 A 60,60 0 0,1 40,100" fill="transparent" />
        </defs>
        
        {/* Anel Exterior Dentado */}
        <circle cx="100" cy="100" r="90" fill="none" stroke={color} strokeWidth="8" strokeDasharray="12,8" />
        <circle cx="100" cy="100" r="82" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="100" cy="100" r="76" fill="none" stroke={color} strokeWidth="1" />
        <circle cx="100" cy="100" r="45" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="1" />

        {/* Textos em Arco */}
        <text fill={color} fontSize="14" fontWeight="bold" letterSpacing="1.5">
          <textPath href={`#${pathIdTop}`} startOffset="50%" textAnchor="middle">
            ★ {upperName} ★
          </textPath>
        </text>
        <text fill={color} fontSize="14" fontWeight="bold" letterSpacing="2">
          <textPath href={`#${pathIdBottom}`} startOffset="50%" textAnchor="middle">
            {nuitText}
          </textPath>
        </text>

        {/* Texto Central Substituído por Localização perfeitamente centrado */}
        <text x="100" y="100" fill={color} fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">
          {locationText}
        </text>
      </svg>
    );
  }

  if (style === "style3") {
    // Estilo Hexagonal Moderno
    return (
      <svg viewBox="0 0 200 200" className={className} style={{ width: "100%", height: "100%" }}>
        {/* Hexagon Outline */}
        <polygon points="100,10 180,55 180,145 100,190 20,145 20,55" fill="none" stroke={color} strokeWidth="5" />
        <polygon points="100,18 173,60 173,140 100,182 27,140 27,60" fill="none" stroke={color} strokeWidth="2" strokeDasharray="6,4" />
        
        {/* Linhas Separadoras */}
        <line x1="30" y1="70" x2="170" y2="70" stroke={color} strokeWidth="2" />
        <line x1="30" y1="130" x2="170" y2="130" stroke={color} strokeWidth="2" />

        {/* Textos Centrais e Topo/Fundo */}
        <text x="100" y="55" fill={color} fontSize="12" fontWeight="bold" textAnchor="middle" letterSpacing="2">
          VALIDADO
        </text>
        
        <text x="100" y="95" fill={color} fontSize="15" fontWeight="900" textAnchor="middle" letterSpacing="1">
          {upperName}
        </text>
        <text x="100" y="115" fill={color} fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="2">
          {nuitText}
        </text>

        <text x="100" y="155" fill={color} fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="1">
          ★ {locationText} ★
        </text>
      </svg>
    );
  }

  // Estilo 1: Redondo Clássico (Padrão)
  return (
    <svg viewBox="0 0 200 200" className={className} style={{ width: "100%", height: "100%" }}>
      <defs>
        <path id={pathIdTop} d="M 30,100 A 70,70 0 0,1 170,100" fill="transparent" />
        <path id={pathIdBottom} d="M 170,100 A 70,70 0 0,1 30,100" fill="transparent" />
      </defs>
      
      {/* Círculos Exteriores e Interiores */}
      <circle cx="100" cy="100" r="92" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="100" cy="100" r="86" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="100" cy="100" r="50" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="100" cy="100" r="46" fill="none" stroke={color} strokeWidth="1" />

      {/* Textos em Arco */}
      <text fill={color} fontSize="16" fontWeight="bold" letterSpacing="1">
        <textPath href={`#${pathIdTop}`} startOffset="50%" textAnchor="middle">
          {upperName}
        </textPath>
      </text>
      <text fill={color} fontSize="16" fontWeight="bold" letterSpacing="2">
        <textPath href={`#${pathIdBottom}`} startOffset="50%" textAnchor="middle">
          {nuitText}
        </textPath>
      </text>

      {/* Texto Central Substituído por Localização perfeitamente centrado */}
      <text x="100" y="100" fill={color} fontSize="16" fontWeight="900" textAnchor="middle" dominantBaseline="middle" letterSpacing="1">
        {locationText}
      </text>
    </svg>
  );
}
