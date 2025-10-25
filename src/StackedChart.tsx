// src/StackedChart.tsx
import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

export const StackedChart: React.FC = () => {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [{ w, h }, setBoxSize] = useState({ w: 800, h: 500 });

  // Observa o container e atualiza dimensões em px (Apex se adapta melhor com números)
  useEffect(() => {
    if (!boxRef.current) return;
    const el = boxRef.current;

    let raf = 0;
    const measure = () => {
      const cr = el.getBoundingClientRect();
      setBoxSize({ w: Math.max(1, Math.floor(cr.width)), h: Math.max(1, Math.floor(cr.height)) });
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };

    // Usa ResizeObserver se existir; senão faz fallback pro resize da janela
    let ro: ResizeObserver | null = null;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(schedule);
      ro.observe(el);
    } else {
      window.addEventListener("resize", schedule);
    }

    // medir na montagem
    schedule();

    return () => {
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();
      else window.removeEventListener("resize", schedule);
    };
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      // NÃO fixar height aqui para não conflitar com <ReactApexChart height={...}/>
      stacked: true,
      foreColor: "#e2e8f0",
      background: "#0f172a",
      toolbar: { show: false },
      redrawOnParentResize: true,
      redrawOnWindowResize: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        columnWidth: "45%",
      },
    },
    xaxis: {
      categories: ["Janeiro", "Fevereiro", "Março"],
      labels: { style: { colors: "#cbd5e1" } },
    },
    yaxis: { labels: { style: { colors: "#cbd5e1" } } },
    legend: {
      position: "top",
      labels: { colors: "#f1f5f9" },
    },
    fill: {
      opacity: 1,
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.4,
        opacityFrom: 0.9,
        opacityTo: 0.7,
      },
    },
    colors: ["#3b82f6", "#22c55e", "#f59e0b"],
    grid: { borderColor: "#334155" },
    tooltip: { theme: "dark" },
    responsive: [
      { breakpoint: 1280, options: { plotOptions: { bar: { columnWidth: "50%" } } } },
      { breakpoint: 1024, options: { legend: { position: "bottom" }, plotOptions: { bar: { columnWidth: "58%" } } } },
      { breakpoint: 768,  options: { plotOptions: { bar: { columnWidth: "65%" } } } },
      { breakpoint: 480,  options: { plotOptions: { bar: { columnWidth: "70%" } }, xaxis: { labels: { rotate: -35 } } } },
    ],
  };

  const series = [
    { name: "Produto A", data: [44, 55, 41] },
    { name: "Produto B", data: [13, 23, 20] },
    { name: "Produto C", data: [11, 17, 15] },
  ];

  return (
    <div className="w-screen h-screen bg-slate-900 flex items-center justify-center p-4">
      <style>{`
        .apexcharts-series path:hover {
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.45));
          transition: filter .15s ease-in-out;
        }
      `}</style>

      {/* Container central — ajuste w-[60vw] se quiser mais largo (ex.: w-[80vw] / w-[90vw]) */}
      <div
        ref={boxRef}
        className="w-[60vw] max-w-[1600px] h-[85vh] md:h-[80vh] sm:h-[72vh] bg-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex items-center justify-center"
      >
        {/* Use height/width em PX calculados para o chart preencher corretamente */}
        <ReactApexChart options={options} series={series} type="bar" height={h} width={w} />
      </div>
    </div>
  );
};
