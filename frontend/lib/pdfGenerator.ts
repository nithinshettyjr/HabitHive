"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export const generateHabitPDF = (habits: any[], month: string) => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  // Title
  pdf.setFontSize(20);
  pdf.text("HabitHive  Habit Tracker", margin, 20);

  // Month
  pdf.setFontSize(12);
  pdf.text(`Month: ${month}`, margin, 30);

  // Table header
  pdf.setFontSize(10);
  let yPosition = 40;
  const cellHeight = 8;
  const daysInMonth = 30;
  const habitWidth = 40;
  const dayWidth = (pageWidth - margin * 2 - habitWidth) / daysInMonth;

  // Draw habits
  habits.forEach((habit, index) => {
    pdf.text(habit.name, margin, yPosition);
    yPosition += cellHeight;

    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
  });

  pdf.save(`HabitHive-HabitTracker-${month}.pdf`);
};
