var LS_TTL = {
  getContratti: 15 * 60 * 1000,
  getClienti:   15 * 60 * 1000
};

function _lsGet(key) {
  try {
    var raw = localStorage.getItem('ks_' + key);
    if (!raw) return null;
    var entry = JSON.parse(raw);
    if (Date.now() > entry.exp) { localStorage.removeItem('ks_' + key); return null; }
    return entry.data;
  } catch(e) { return null; }
}

function _lsPut(key, data, ttlMs) {
  try { localStorage.setItem('ks_' + key, JSON.stringify({ data: data, exp: Date.now() + ttlMs })); }
  catch(e) {}
}

async function apiCall(action, params) {
  var url = new URL(CONFIG.APPS_SCRIPT_URL);
  url.searchParams.set('action', action);
  if (params) Object.keys(params).forEach(function(k) { url.searchParams.set(k, params[k]); });
  var res = await fetch(url.toString(), { redirect: 'follow' });
  var text = await res.text();
  var data;
  try { data = JSON.parse(text); }
  catch(e) { throw new Error('Risposta GAS non valida (' + action + '): server occupato o timeout. Riprova tra qualche secondo.'); }
  if (data && data.error) throw new Error(data.error);
  return data;
}

async function cachedApiCall(action, params) {
  var ttl = LS_TTL[action];
  if (ttl) {
    var cached = _lsGet(action);
    if (cached) return cached;
  }
  var data = await apiCall(action, params);
  if (ttl) _lsPut(action, data, ttl);
  return data;
}

var API = {
  getContratti:       function()          { return cachedApiCall('getContratti'); },
  getClienti:         function()          { return cachedApiCall('getClienti'); },
  getProdotti:        function()          { return apiCall('getProdotti'); },
  getAgenzie:         function()          { return apiCall('getAgenzie'); },
  getContrattoDetail:      function(numOrdine)    { return apiCall('getContrattoDetail',      { num_ordine:     numOrdine });    },
  getContrattoCommerciale: function(numContratto) { return apiCall('getContrattoCommerciale', { num_contratto: numContratto }); },
  getAnomalieByMese:       function(mese)         { return apiCall('getAnomalieByMese', { mese: mese }); },
  getSegnalazioni:         function()             { return apiCall('getSegnalazioni'); },
  getComunicazioni:        function(segId)        { return apiCall('getComunicazioni', { seg_id: segId }); },
  getLotti:                function()             { return apiCall('getLotti'); },
  aggiungiComunicazione:   function(segId, tipo, testo, lottoId) {
    return apiCall('aggiungiComunicazione', { seg_id: segId, tipo: tipo, testo: testo, lotto_id: lottoId || '' });
  },
  creaLotto:               function(segIds, oggetto, note) {
    return apiCall('creaLotto', { seg_ids: segIds, oggetto: oggetto, note: note || '' });
  },
  chiudiSegnalazione:      function(segId, stato, note) {
    return apiCall('chiudiSegnalazione', { seg_id: segId, stato: stato, note: note });
  },
  getSegnalazioniChiuse:   function() { return apiCall('getSegnalazioniChiuse'); },
  riapriSegnalazione:      function(segId) { return apiCall('riapriSegnalazione', { seg_id: segId }); },
  clearCache:              function()             { Object.keys(LS_TTL).forEach(function(k) { localStorage.removeItem('ks_' + k); }); },
  clearServerCache:        function()             { return apiCall('clearCache'); }
};
