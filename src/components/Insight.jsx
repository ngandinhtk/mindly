import React, { useState, useEffect, useRef } from 'react';
import { emotions } from '../data/emotions';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import WeeklySummary from './WeeklySummary';

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
    const insightRef = useRef();

    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            const savedEntries = localStorage.getItem(`moodEntries_${username}`);
            if (savedEntries) {
                const parsedEntries = JSON.parse(savedEntries);
                calculateStats(parsedEntries);
            }
        }
    }, []);

    const calculateStats = (entries) => {
        if (!entries || entries.length === 0) {
            return;
        }

        const emotionCounts = entries.reduce((acc, entry) => {
            acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
            return acc;
        }, {});

        const totalEntries = entries.length;
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

    const getOverallTrend = () => {
        if (emotionStats.length === 0) {
            return t('no_data_trend');
        }
        const topEmotion = emotionStats[0];
        
        // Simple trend message based on the most frequent emotion's ID
        if (['happy', 'excited', 'grateful', 'amazing', 'satisfies'].includes(topEmotion.id)) {
            return t('positive_trend');
        }
        if (['sad', 'angry', 'anxious', 'worried'].includes(topEmotion.id)) {
            return t('negative_trend');
        }
        return t('netive_trend');
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
         <div className="space-y-6 ">

            <div className="p-8" ref={insightRef}>
              <h3 className="text-2xl font-bold  text-gray-800 mb-6">{t('emotion_stats')}</h3>              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {emotionStats.length > 0 ? (
                    emotionStats.map(stat => (
                        <div key={stat.id} className={`${stat.color} text-center p-6 rounded-xl transform transition-transform hover:scale-105`}>
                            <div className="text-4xl mb-2">{stat.emoji}</div>
                            <div className="text-2xl font-bold text-gray-800">{stat.percentage}%</div>
                            <div className="text-sm text-gray-600">{stat.count} {t('day')} {t(stat.label)}</div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-600">{t('no_data_for_week')}</p>
                        <p className="text-sm text-gray-400">{t('start_journaling')}</p>
                    </div>
                )}
                            <div className="text-center">
        
            </div>
              </div>
                {/* <h4 className="font-semibold text-gray-800 mb-3">{t('trending_analysis')}</h4> */}
                <p className="text-gray-600">
                  {getOverallTrend()}
                </p>
                
              <div className=" text-center ">
                     <button
                    onClick={handleExportPDF}
                    className=" bg-purple-600 hover:bg-purple-700 text-white font-bold  px-4 m-4  rounded"
                >
                    {t('export_pdf')}
                </button>
              </div>
            </div>
         <WeeklySummary />
          </div>
    );
};

export default Insight;
