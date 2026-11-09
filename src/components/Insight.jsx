import React, { useState, useEffect, useRef } from 'react';
import { emotions } from '../data/emotions';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import WeeklySummary from './WeeklySummary';
import { getMoodTrend, readMoodEntries } from './moodStats';

const Insight = () => {
    const { t } = useTranslation();
    window.html2canvas = html2canvas;

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling'],
      });
      
    const [emotionStats, setEmotionStats] = useState([]);
    const [trendKey, setTrendKey] = useState('no_data_trend');
    const [loadError, setLoadError] = useState(false);
    const insightRef = useRef();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            const result = readMoodEntries(username);
            calculateStats(result.entries);
            setTrendKey(getMoodTrend(result.entries));
            setLoadError(result.error);
        }
    }, []);

    const calculateStats = (entries) => {
        if (!Array.isArray(entries) || entries.length === 0) {
            return;
        }

        const emotionCounts = entries.reduce((acc, entry) => {
            if (!entry || typeof entry.emotion !== 'string') return acc;
            acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
            return acc;
        }, {});

        const totalEntries = Object.values(emotionCounts).reduce((total, count) => total + count, 0);
        if (totalEntries === 0) return;
        const stats = Object.entries(emotionCounts)
            .map(([emotionId, count]) => {
                const emotionDetails = emotions.find(e => e.id === emotionId);
                return {
                    id: emotionId,
                    count,
                    percentage: Math.round((count / totalEntries) * 100),
                    ...(emotionDetails || { label: 'Unknown', emoji: '❓', color: 'bg-gray-200' }),
                };
            })
            .sort((a, b) => b.count - a.count);

        setEmotionStats(stats);
    };

    const handleExportPDF = () => {
        const input = insightRef.current;
        html2canvas(input, { useCORS: true })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;
                const width = pdfWidth;
                const height = width / ratio;

                let position = 0;
                let heightLeft = height;

                pdf.addImage(imgData, 'PNG', 0, position, width, height);
                heightLeft -= pdfHeight;

                while (heightLeft > 0) {
                    position = heightLeft - height;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, position, width, height);
                    heightLeft -= pdfHeight;
                }
                
                pdf.save("mindly-insight.pdf");
            });
    };

    return (
                 <div className="w-full min-w-0 space-y-6">

                        <div className="p-4 sm:p-8" ref={insightRef}>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{t('emotion_stats')}</h3>              
                            {loadError && <p role="alert" className="mb-4 text-sm text-red-700">{t('insight_data_load_failed')}</p>}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emotionStats.length > 0 ? (
                    emotionStats.map(stat => (
                        <div key={stat.id} className={`${stat.color} text-center p-4 sm:p-6 rounded-xl transform transition-transform hover:scale-105`}>
                            <div className="text-4xl mb-2">{stat.emoji}</div>
                            <div className="text-2xl font-bold text-gray-800">{stat.percentage}%</div>
                            <div className="text-sm text-gray-600">{stat.count} {t('check_in_count')} · {t(stat.label)}</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-600">{t('no_data_for_week')}</p>
                        <p className="text-sm text-gray-400">{t('start_journalling')}</p>
                    </div>
                )}
                            <div className="text-center">
        
            </div>
              </div>
                {/* <h4 className="font-semibold text-gray-800 mb-3">{t('trending_analysis')}</h4> */}
                <p className="text-gray-600">
                  {t(trendKey)}
                </p>
                
            </div>
                        <div className="text-center">
                            <button
                                onClick={handleExportPDF}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 m-4 rounded"
                            >
                                {t('export_pdf')}
                            </button>
                        </div>
         <WeeklySummary />
          </div>
    );
};

export default Insight;
