async function apiCall(action, params) {
  var url = new URL(CONFIG.APPS_SCRIPT_URL);
  url.searchParams.set('action', action);
  if (params) Object.keys(params).forEach(function(k) { url.searchParams.set(k, params[k]); });
  var res  = await fetch(url.toString(), { redirect: 'follow' });
  var data = await res.json();
  if (data && data.error) throw new Error(data.error);
  return data;
}

var API = {
  getContratti:       function()         { return apiCall('getContratti'); },
  getClienti:         function()         { return apiCall('getClienti'); },
  getProdotti:        function()         { return apiCall('getProdotti'); },
  getAgenzie:         function()         { return apiCall('getAgenzie'); },
  getContrattoDetail: function(numOrdine){ return apiCall('getContrattoDetail', { num_ordine: numOrdine }); }
};
