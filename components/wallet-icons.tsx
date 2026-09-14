export const WalletIcon = ({ type, className = "w-10 h-10" }: { type: string; className?: string }) => {
  const walletStyles: Record<string, { bg: string; text: string; label: string }> = {
    aktionariat: { bg: "bg-green-700", text: "text-white", label: "AK" },
    binance: { bg: "bg-yellow-400", text: "text-gray-900", label: "BN" },
    bitcoin: { bg: "bg-orange-500", text: "text-white", label: "₿" },
    bitkeep: { bg: "bg-purple-600", text: "text-white", label: "BK" },
    bitpay: { bg: "bg-blue-800", text: "text-white", label: "BP" },
    blockchain: { bg: "bg-green-600", text: "text-white", label: "BC" },
    coinbase: { bg: "bg-green-700", text: "text-white", label: "CB" },
    "coinbase-one": { bg: "bg-green-700", text: "text-white", label: "C1" },
    crypto: { bg: "bg-blue-900", text: "text-white", label: "CR" },
    exodus: { bg: "bg-purple-700", text: "text-white", label: "EX" },
    gemini: { bg: "bg-cyan-500", text: "text-white", label: "GM" },
    imtoken: { bg: "bg-green-600", text: "text-white", label: "IM" },
    infinito: { bg: "bg-green-700", text: "text-white", label: "IN" },
    infinity: { bg: "bg-violet-600", text: "text-white", label: "∞" },
    keyringpro: { bg: "bg-green-600", text: "text-white", label: "KR" },
    metamask: { bg: "bg-orange-400", text: "text-white", label: "MM" },
    ownbit: { bg: "bg-teal-600", text: "text-white", label: "OB" },
    phantom: { bg: "bg-purple-500", text: "text-white", label: "PH" },
    pulse: { bg: "bg-red-500", text: "text-white", label: "PL" },
    rainbow: { bg: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500", text: "text-white", label: "RB" },
    robinhood: { bg: "bg-green-500", text: "text-white", label: "RH" },
    safepal: { bg: "bg-green-800", text: "text-white", label: "SP" },
    sparkpoint: { bg: "bg-indigo-500", text: "text-white", label: "SK" },
    trust: { bg: "bg-green-600", text: "text-white", label: "TW" },
    uniswap: { bg: "bg-pink-500", text: "text-white", label: "UN" },
    walletio: { bg: "bg-slate-700", text: "text-white", label: "WI" },
  };

  const style = walletStyles[type];

  if (!style) {
    return (
      <div className={`${className} bg-green-600/10 dark:bg-green-500/20 rounded-full flex items-center justify-center`}>
        <svg className="w-1/2 h-1/2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`${className} ${style.bg} rounded-full flex items-center justify-center`}>
      <span className={`${style.text} font-bold text-xs`}>{style.label}</span>
    </div>
  );
};
