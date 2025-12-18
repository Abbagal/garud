import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Lock, Unlock, Loader2, FileCode, FileSpreadsheet, FileImage } from 'lucide-react'
import { DossierItem } from '../data/mockData'

interface DossierListProps {
    items: DossierItem[];
}

const DossierList = ({ items }: DossierListProps) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-500 mb-4 border-b border-red-500/30 pb-2">
                <Lock className="w-4 h-4" />
                <h3 className="text-sm font-bold font-mono tracking-wider">INTERCEPTED INTEL</h3>
                <span className="text-[10px] bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                    {items.length} FILES
                </span>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <DossierItemView key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}

const DossierItemView = ({ item }: { item: DossierItem }) => {
    const [decrypted, setDecrypted] = useState(false);
    const [decrypting, setDecrypting] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleDecrypt = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (decrypted) return;

        setDecrypting(true);
        setTimeout(() => {
            setDecrypting(false);
            setDecrypted(true);
            setExpanded(true);
        }, 2000); // 2 second decryption simulation
    };

    const getIcon = () => {
        switch (item.type) {
            case 'REPORT': return <FileText className="w-4 h-4" />;
            case 'LOG': return <FileSpreadsheet className="w-4 h-4" />;
            case 'BLUEPRINT': return <FileImage className="w-4 h-4" />;
            case 'TRANSCRIPT': return <FileCode className="w-4 h-4" />;
            default: return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className={`
      border rounded-lg transition-all duration-300
      ${decrypted ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-cyan-500/30 bg-navy-900'}
      hover:border-cyan-400/50
    `}>
            {/* Header */}
            <div
                className="p-3 cursor-pointer flex items-start gap-3"
                onClick={() => decrypted && setExpanded(!expanded)}
            >
                <div className={`mt-1 ${decrypted ? 'text-emerald-400' : 'text-cyan-500'}`}>
                    {getIcon()}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h4 className="text-slate-200 font-mono text-xs font-bold truncate pr-2 uppercase">
                            {item.title}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] font-mono text-slate-500">{item.date}</span>
                            {!decrypted && (
                                <button
                                    onClick={handleDecrypt}
                                    disabled={decrypting}
                                    className={`
                                text-[10px] font-bold px-2 py-1 rounded border transition-all flex items-center gap-1
                                ${decrypting
                                            ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 cursor-wait'
                                            : 'bg-transparent border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-navy-950'
                                        }
                            `}
                                >
                                    {decrypting ? (
                                        <><Loader2 className="w-3 h-3 animate-spin" /> DECRYPTING</>
                                    ) : (
                                        "DECRYPT"
                                    )}
                                </button>
                            )}
                            {decrypted && (
                                <div className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold border border-emerald-500/30 px-2 py-1 rounded bg-emerald-500/10">
                                    <Unlock className="w-3 h-3" /> DECRYPTED
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-[10px] px-1.5 rounded border ${decrypted ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : 'border-cyan-500/20 text-cyan-400 bg-cyan-500/10'}`}>
                            {item.type}
                        </span>
                        {item.tags.map(tag => (
                            <span key={tag} className="text-[10px] text-slate-500 border border-slate-700 px-1.5 rounded bg-slate-800/50">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
                {expanded && decrypted && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/20 border-t border-emerald-500/20"
                    >
                        <div className="p-3">
                            <div className="text-[10px] text-emerald-500 font-mono mb-2 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                DECRYPTED CONTENT // {item.classification}
                            </div>
                            <div className="text-xs text-slate-300 font-mono leading-relaxed p-3 bg-emerald-950/20 rounded border border-emerald-500/10 border-l-2 border-l-emerald-500">
                                <p className="mb-2 font-bold text-emerald-400/80">SUMMARY:</p>
                                {item.summary}
                                <div className="mt-3 pt-3 border-t border-emerald-500/20">
                                    <p className="font-bold text-emerald-400/80 mb-1">RAW SNIPPET:</p>
                                    <pre className="text-[10px] whitespace-pre-wrap text-emerald-400/60 font-mono">
                                        {item.content}
                                    </pre>
                                </div>
                            </div>
                            {item.fileName ? (
                                <a
                                    href={`/documents/${encodeURIComponent(item.fileName)}`}
                                    download={item.fileName}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-2 text-[10px] text-center block py-1 transition-colors border border-dashed rounded text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer"
                                    onClick={(e) => {
                                        // Allow default behavior but ensure target="_blank" handles it or use the download attribute
                                    }}
                                >
                                    DOWNLOAD FILE ({item.fileName.split('.').pop()?.toUpperCase()})
                                </a>
                            ) : (
                                <div className="w-full mt-2 text-[10px] text-center block py-1 transition-colors border border-dashed rounded text-slate-600 border-slate-700 cursor-not-allowed">
                                    FILE UNAVAILABLE
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
export default DossierList
