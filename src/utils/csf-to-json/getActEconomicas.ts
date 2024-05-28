type ActividadesEntry = {
  orden: string;
  actividadEconomica: string;
  porcentaje: string;
  fechaInicio: string;
  fechaFin: string;
};

export function getActEconomicas(csf: string) {
  const economyActivities = csf.match(
    /Actividades\s+Económicas:\s+(.*?)\s+Regímenes/,
  )?.[1];

  if (!economyActivities) return [];

  const regex =
    /\s*(\d+)\s+([^0-9]+?)\s+(\d+)\s+(\d{2}\/\d{2}\/\d{4})(\s+\d{2}\/\d{2}\/\d{4})?\s*/g;

  const activities: ActividadesEntry[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(economyActivities)) !== null) {
    const [, orden, actividadEconomica, porcentaje, fechaInicio, fechaFin] =
      match;

    activities.push({
      orden: orden.trim(),
      actividadEconomica: actividadEconomica.trim(),
      porcentaje: porcentaje.trim(),
      fechaInicio: fechaInicio.trim(),
      fechaFin: fechaFin ? fechaFin.trim() : "",
    });
  }

  return activities;
}
