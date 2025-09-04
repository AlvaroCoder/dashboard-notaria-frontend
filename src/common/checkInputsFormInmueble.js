export function checkEmptyFieldsFormCompra(dataCompra) {
    let listaErroresCompra = [];
  
    for (let i = 0; i < dataCompra.length; i++) {
      const person = dataCompra[i];
      let hasError = false;
  
      // Validar campos planos principales
      const camposObligatorios = ['firstName', 'lastName', 'dni', 'gender', 'nationality', 'age', 'job'];
      for (const campo of camposObligatorios) {
        if (!person[campo] || String(person[campo]).trim() === '') {
          hasError = true;
        }
      }
  
      // Validar dirección
      if (person.address) {
        const camposDireccion = ['name', 'district', 'province', 'department'];
        for (const campo of camposDireccion) {
          if (!person.address[campo] || String(person.address[campo]).trim() === '') {
            hasError = true;
          }
        }
      } else {
        hasError = true; // address no debería ser nulo
      }
  
      // Validar estado civil
      const civil = person.maritalStatus?.civilStatus || '';
      const isCasado = civil === 'casado' || civil === 'casada';
  
      if (isCasado) {
        if (person.maritalStatus.moreInfo) {
          if (person.bienesMancomunados) {
            // Bienes mancomunados => validar spouse completo
            const spouse = person.maritalStatus?.spouse;
            if (
              !spouse ||
              !spouse.firstName || !spouse.lastName ||
              !spouse.dni || !spouse.gender ||
              !spouse.job || !spouse.nationality
            ) {
              hasError = true;
            }
          } else {
            // Bienes separados => validar marriageType
            const marriageType = person.maritalStatus?.marriageType;
            if (
              !marriageType ||
              !marriageType.partidaRegistralNumber ||
              !marriageType.province
            ) {
              hasError = true;
            }
          }
        }

      }
  
      if (hasError) {
        listaErroresCompra[i] = {
          error: true,
          value: 'Por favor completar el formulario'
        };
      }
    }
  
    return listaErroresCompra;
  }


export function checkEvidenceEmpty(data=[]) {
    return data?.length > 0 ? {error : false, value : "Evidencias subidas"} : {error : true, value : 'Suba las evidencia de pago'}
}