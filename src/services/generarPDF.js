// © 2025–2026 Joana Uribe — Todos los derechos reservados.
// Uso, copia o distribución sin autorización escrita está prohibido.
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export async function exportarExpedientePDF(paciente) {
  const ant = paciente.antecedentes || {};
  const fecha = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const sesionesHTML = paciente.sesiones.length === 0
    ? '<p class="empty">Sin sesiones registradas</p>'
    : paciente.sesiones.map(s => `
        <div class="card">
          <div class="card-header">
            <span class="badge">${s.fecha}</span>
            <span class="muted">⏱ ${s.duracion} &nbsp;|&nbsp; 👩‍⚕️ ${s.terapeuta}</span>
          </div>
          ${s.objetivo  ? `<p><strong>Objetivo:</strong> ${s.objetivo}</p>` : ''}
          <p><strong>Actividades:</strong> ${s.actividades.join(', ')}</p>
          ${s.respuesta ? `<p><strong>Respuesta:</strong> ${s.respuesta}</p>` : ''}
          ${s.notas     ? `<p><strong>Notas:</strong> ${s.notas}</p>` : ''}
          ${s.planSiguiente ? `<p><strong>Plan siguiente sesión:</strong> ${s.planSiguiente}</p>` : ''}
        </div>`).join('');

  const evaluacionesHTML = paciente.evaluaciones.length === 0
    ? '<p class="empty">Sin evaluaciones registradas</p>'
    : paciente.evaluaciones.map(ev => `
        <div class="card">
          <div class="card-header">
            <span class="badge green">${ev.nombre}</span>
            <span class="muted">${ev.fecha}</span>
          </div>
          <p><strong>Resultado:</strong> ${ev.puntaje}</p>
          <p>${ev.observaciones}</p>
        </div>`).join('');

  const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Expediente – ${paciente.nombre}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Georgia', serif; color: #1a1a1a; background: #fff; font-size: 13px; line-height: 1.6; }

      .header { background: linear-gradient(135deg, #051F20, #235347); color: #DBF0DD; padding: 32px 40px; }
      .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
      .logo { font-size: 28px; font-weight: 900; letter-spacing: 3px; color: #8CB79B; }
      .logo-sub { font-size: 11px; color: #8CB79B; letter-spacing: 1px; margin-top: 2px; }
      .header-date { font-size: 11px; color: #8CB79B; text-align: right; }
      .patient-name { font-size: 26px; font-weight: bold; margin-top: 20px; color: #DBF0DD; }
      .patient-diag { font-size: 14px; color: #8CB79B; margin-top: 4px; }
      .chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; }
      .chip { background: rgba(255,255,255,0.12); padding: 4px 14px; border-radius: 20px; font-size: 11px; color: #DBF0DD; }

      .body { padding: 30px 40px; }

      .section { margin-bottom: 28px; }
      .section-title { font-size: 15px; font-weight: bold; color: #235347; border-left: 4px solid #8CB79B; padding-left: 10px; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }

      .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .info-row { display: flex; gap: 6px; font-size: 12px; }
      .info-label { color: #666; min-width: 120px; font-style: italic; }
      .info-value { color: #1a1a1a; font-weight: 500; }

      .card { background: #f7faf7; border: 1px solid #d4e8d4; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
      .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
      .badge { background: #235347; color: #DBF0DD; padding: 3px 12px; border-radius: 12px; font-size: 11px; font-weight: bold; }
      .badge.green { background: #8CB79B; color: #051F20; }
      .muted { color: #888; font-size: 11px; }
      .card p { font-size: 12px; margin-bottom: 4px; color: #333; }
      .empty { color: #aaa; font-style: italic; font-size: 12px; }

      .ant-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      .ant-item { background: #f7faf7; border: 1px solid #d4e8d4; border-radius: 8px; padding: 12px; }
      .ant-label { font-size: 10px; font-weight: bold; color: #235347; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
      .ant-value { font-size: 12px; color: #333; }

      .footer { background: #051F20; color: #8CB79B; text-align: center; padding: 16px; font-size: 10px; margin-top: 40px; }
      .divider { border: none; border-top: 1px solid #d4e8d4; margin: 20px 0; }

      @media print { body { -webkit-print-color-adjust: exact; } }
    </style>
  </head>
  <body>

    <!-- PORTADA -->
    <div class="header">
      <div class="header-top">
        <div>
          <div class="logo">TOF</div>
          <div class="logo-sub">Terapia Ocupacional Fernanda</div>
        </div>
        <div class="header-date">
          Expediente generado<br/>${fecha}
        </div>
      </div>
      <div class="patient-name">${paciente.nombre}</div>
      <div class="patient-diag">${paciente.diagnostico}</div>
      <div class="chips">
        <span class="chip">🎂 ${paciente.edad} años</span>
        <span class="chip">⚧ ${paciente.sexo}</span>
        <span class="chip">📋 ${paciente.sesiones.length} sesiones</span>
        <span class="chip">📊 ${paciente.evaluaciones.length} evaluaciones</span>
        <span class="chip">${paciente.activo ? '✓ Activo' : 'Alta'}</span>
      </div>
    </div>

    <div class="body">

      <!-- DATOS PERSONALES -->
      <div class="section">
        <div class="section-title">👤 Datos personales</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-label">Fecha de nacimiento:</span><span class="info-value">${paciente.fechaNacimiento || '—'}</span></div>
          <div class="info-row"><span class="info-label">Teléfono:</span><span class="info-value">${paciente.telefono || '—'}</span></div>
          <div class="info-row"><span class="info-label">Correo:</span><span class="info-value">${paciente.correo || '—'}</span></div>
          <div class="info-row"><span class="info-label">Ocupación:</span><span class="info-value">${paciente.ocupacion || '—'}</span></div>
          <div class="info-row"><span class="info-label">Estado civil:</span><span class="info-value">${paciente.estadoCivil || '—'}</span></div>
          <div class="info-row"><span class="info-label">Escolaridad:</span><span class="info-value">${paciente.escolaridad || '—'}</span></div>
        </div>
      </div>

      <hr class="divider"/>

      <!-- INFORMACIÓN CLÍNICA -->
      <div class="section">
        <div class="section-title">🏥 Información clínica</div>
        <div class="info-grid">
          <div class="info-row"><span class="info-label">Alergias:</span><span class="info-value">${paciente.alergias || '—'}</span></div>
          <div class="info-row"><span class="info-label">Medicamentos:</span><span class="info-value">${paciente.medicamentos || '—'}</span></div>
        </div>
        <div style="margin-top:10px;">
          <div class="info-row"><span class="info-label">Motivo de consulta:</span><span class="info-value">${paciente.motivoConsulta || '—'}</span></div>
        </div>
      </div>

      <hr class="divider"/>

      <!-- ANTECEDENTES -->
      <div class="section">
        <div class="section-title">📋 Antecedentes clínicos</div>
        <div class="ant-grid">
          ${[
            { label: 'Heredofamiliares',         key: 'heredofamiliares' },
            { label: 'Personales patológicos',   key: 'personalesPatologicos' },
            { label: 'Personales no patológicos',key: 'personalesNoPatologicos' },
            { label: 'Quirúrgicos',              key: 'quirurgicos' },
            { label: 'Traumatológicos',          key: 'traumatologicos' },
            { label: 'Gineco-obstétricos',       key: 'ginecologicos' },
          ].map(a => `
            <div class="ant-item">
              <div class="ant-label">${a.label}</div>
              <div class="ant-value">${ant[a.key] || 'Sin registro'}</div>
            </div>`).join('')}
        </div>
      </div>

      <hr class="divider"/>

      <!-- SESIONES -->
      <div class="section">
        <div class="section-title">🗓 Historial de sesiones</div>
        ${sesionesHTML}
      </div>

      <hr class="divider"/>

      <!-- EVALUACIONES -->
      <div class="section">
        <div class="section-title">📊 Evaluaciones aplicadas</div>
        ${evaluacionesHTML}
      </div>

    </div>

    <div class="footer">
      TOF – Terapia Ocupacional Fernanda &nbsp;|&nbsp; Expediente confidencial &nbsp;|&nbsp; Generado el ${fecha}
    </div>

  </body>
  </html>`;

  try {
    const { uri } = await Print.printToFileAsync({ html, base64: false });

    const nombreArchivo = `TOF_Expediente_${paciente.nombre.replace(/ /g, '_')}_${Date.now()}.pdf`;

    const puedeCompartir = await Sharing.isAvailableAsync();
    if (puedeCompartir) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `Expediente de ${paciente.nombre}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      throw new Error('Compartir no disponible en este dispositivo');
    }
    return { success: true };
  } catch (error) {
    console.error('Error generando PDF:', error);
    return { success: false, error: error.message };
  }
}