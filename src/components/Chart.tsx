import {
    createChart,
    type IChartApi,
    type Time,
    type ISeriesApi,
    CandlestickSeries,
    HistogramSeries,
} from "lightweight-charts";
import {useEffect, useRef} from "react";
import type {Candle} from "../types/Market";

interface ChartProps {
    candles: Candle[];
    symbol: string;
}

export default function Chart({candles, symbol}: ChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || chartRef.current) return;

        chartRef.current = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: {color: "#131722"},
                textColor: "#d1d4dc",
            },
            grid: {
                vertLines: {color: "#2B2B43"},
                horzLines: {color: "#2B2B43"},
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        candleSeriesRef.current = chartRef.current.addSeries(
            CandlestickSeries,
            {
                upColor: "#26a69a",
                downColor: "#ef5350",
                title: `${symbol}`,
            }
        );

        volumeSeriesRef.current = chartRef.current.addSeries(HistogramSeries, {
            color: "#26a69a",
            priceFormat: {type: "volume"},
            priceScaleId: "",
        });

        candleSeriesRef.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.2,
                bottom: 0.4,
            },
        });
        volumeSeriesRef.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        });

        const resizeObserver = new ResizeObserver(() => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        });

        resizeObserver.observe(chartContainerRef.current); 
        chartRef.current?.timeScale().fitContent();

        return () => {
            resizeObserver.disconnect();
            chartRef.current?.remove();
            chartRef.current = null;
        };
    }, [symbol]);

    useEffect(() => {
        if (!candleSeriesRef.current || !volumeSeriesRef.current) return;

        const chartData = candles.map((c) => ({
            time: Math.floor(c.timestamp / 1000) as Time,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
        }));

        const volumeData = candles.map((c) => ({
            time: Math.floor(c.timestamp / 1000) as Time,
            value: c.volume,
            color: c.close >= c.open ? "#26a69a" : "#ef5350",
        }));

        candleSeriesRef.current.setData(chartData);
        volumeSeriesRef.current.setData(volumeData);
    }, [candles]);

    return (
        <div
            ref={chartContainerRef}
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                borderRadius: "12px",
                overflow: "hidden",
            }}
        />
    );
}
