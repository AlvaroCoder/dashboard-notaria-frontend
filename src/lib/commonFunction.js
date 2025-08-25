export function hasEmptyFieldsTestimony(obj) {
    if (obj === null || obj === undefined) return true;
    
    if (typeof obj === "string") return obj.trim() === "";
    
    if (Array.isArray(obj)) {
      return obj.some(item => hasEmptyFieldsTestimony(item));
    }
    
    if (typeof obj === "object") {
      return Object.values(obj).some(value => hasEmptyFieldsTestimony(value));
    }
    
    return false; // número, boolean u otros valores están bien
  }

  export function hasEmptyFieldsUploadMinuta(detailsMinuta) {
    return  detailsMinuta?.number.trim() === '' || detailsMinuta?.districtPlace.trim() === '' || detailsMinuta?.creationDay.trim() === ''
  }