const analyzer = require('./analyzer');
const fetch = require('./fetch');
const fetchStuff = require('./fetchStuff');
const JSQueue = require('js-queue');
const {PerformanceObserver, performance} = require('perf_hooks');
// const fs = require('fs');
const Database = require('../../../db');

const db = new Database();

class Queue {
    constructor() {
        if (!Queue.instance) {
            this.JSQueue = new JSQueue();
            Queue.instance = this;
        }
        return Queue.instance;
    }

    push(initTime, searchTerm, status, runtime, content) {
        this.JSQueue.add(this.searchInsidePages({
            initTime: Date.now(),
            searchTerm: searchTerm,
            status: status,
            runtime: 0,
            content: content
        }));
    }

    async searchInsidePages(objeto) {
        // console.log("Recibo", objeto);
        //console.log('soy searchTerm -->', this.getSearchTerm());
        let result = [];
        let t0 = performance.now();
        const uncleanurls = await fetch(objeto.searchTerm);
        const urls = await analyzer(uncleanurls);
        console.log('soy urls -->', urls);
        const forLoop = async _ => {
            console.log('Start');
            for (let i = 0; i < urls.length; i++) {
                const start = performance.now();
                const href = urls[i].href;
                let content = {url: href, estado: 'pendiente'};
                try {
                    content = await fetchStuff(href);
                    content.estado = 'finalizado';
                    content.url = href;
                    content.busqueda = objeto.searchTerm;
                } catch (e) {
                    content = {...content, estado: 'error', error: e.message, url: href, busqueda: objeto.searchTerm};
                }

                await result.push(content);
                const end = performance.now();

                content.runtime = (end - start) + " ms";
                console.log("el indice nº:", i, "\n", "url: ", href, "\n", "contenido: ", content, "\n\n")
            }
        };

        await forLoop();
        let t1 = performance.now();
        objeto.content = result;
        objeto.status = "procesado";
        // let json2 = JSON.stringify(result, null, ' ');
        // fs.writeFile('response2.json', json2);
        console.log('End');

        await db.connect();
        //await db.addResults('busquedas', result);
        //await db.getAllResults('busquedas');
        //await db.getResultById("busquedas", '5de51f02c4c21487185b7b7f')
        //await db.getResultBySearch("busquedas", 'Bague')
        return objeto;
    }

}

module.exports = Queue;