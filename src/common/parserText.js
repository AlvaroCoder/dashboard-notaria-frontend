export function parseTextoToJSON(textoPlano) {
    const data = [];
    const lineas = textoPlano.trim().split(/\n+/);
  
    const regexClausula = /^(PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA)\.-/;
    const regexClausulaAdicional = /^CLÁUSULA ADICIONAL:/;
  
    // Agrega el título inicial
    if (lineas[0].startsWith("SEÑOR NOTARIO:")) {
      data.push({
        type: "heading-one",
        content: "SEÑOR NOTARIO:",
        html: "<h1>SEÑOR NOTARIO:</h1>"
      });
      lineas.shift();
    }
  
    let bufferParrafo = [];
  
    const flushParrafo = () => {
      if (bufferParrafo.length === 0) return;
    
      const contenido = bufferParrafo.join(" ").trim();
    
      data.push({
        type: "paragraph",
        content: [
          {
            type: "text",
            content: contenido,
            html: contenido
          }
        ],
        html: `<p>${contenido}</p>`
      });
    
      bufferParrafo = [];
    };
  
    for (let linea of lineas) {
      linea = linea.trim();
  
      if (regexClausula.test(linea)) {
        flushParrafo();
        const [titulo, ...contenido] = linea.split(".");
        const nombre = titulo.trim().replace("-", "");
  
        data.push({
          type: "paragraph",
          content: [
            {
              type: "bold",
              content: `${nombre}.-`,
              html: `<b>${nombre}.-</b>`
            },
            {
              type: "text",
              content: contenido.join(".").trim(),
              html: contenido.join(".").trim()
            }
          ],
          html: `<p><b>${nombre}.-</b> ${contenido.join(".").trim()}</p>`
        });
      } else if (regexClausulaAdicional.test(linea)) {
        flushParrafo();
        const contenido = linea.split(":")[1].trim();
        data.push({
          type: "paragraph",
          content: [
            {
              type: "bold",
              content: "CLÁUSULA ADICIONAL:",
              html: "<b>CLÁUSULA ADICIONAL:</b>"
            },
            {
              type: "text",
              content: contenido,
              html: contenido
            }
          ],
          html: `<p><b>CLÁUSULA ADICIONAL:</b> ${contenido}</p>`
        });
      } else if (linea.length > 0) {
        bufferParrafo.push(linea);
      }
    }
  
    flushParrafo(); // Finaliza el último párrafo si quedó algo pendiente
  
    return { data };
  }