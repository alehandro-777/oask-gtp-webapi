const QueryService = require('./query')

class ReportNotFixwedRowSetService {
    //create excel cells
    async create(report_cfg, begin, end) {

        //query all data
        let dataMap = await this.execQueryDatasetMap(report_cfg, begin, end);                

        let cells = [];
        let row_index = 1;
        //create cells
        //iterate rows config
        for (let i = 0; i < report_cfg.rows.length; i++) { 
            const row_cfg = report_cfg.rows[i];
            if (row_cfg.row_offset) row_index =  row_cfg.row_offset;

            let ds_key = row_cfg.dataset;          
            let data_set = dataMap.get(ds_key);

            let groups = this.createGroupRowsMap(row_cfg, data_set);           
            
            //row can grow !!!
            for (let row_key of groups.keys() ) {
                
                let col_index_arr = report_cfg.columns.map(c=>0);            
                //TODO add fixed group cells
                for (let j = 0; j < report_cfg.columns.length; j++) {
                    let col_cfg = report_cfg.columns[j];
                    let group_data_array = groups.get(row_key)
                    
                    let values = this.filterColumn(col_cfg.filter, group_data_array);
                    
                    //console.log(row_key, values);
                    for (let k = 0; k < values.length; k++) {
                        const value = values[k];
                        let cell_row_index = row_index + k;
                        col_index_arr[j] = k;
                        let cell = {};
                        cell.key = col_cfg.key + cell_row_index;
                        cell.data = value[col_cfg.cell_field];
                        
                        cells.push(cell);
                                        
                        this.addKeyCell(cells, row_key, row_cfg, cell_row_index);
                    }
                }
                let max_idx = Math.max(...col_index_arr);                
                row_index = row_index + max_idx + 1;                
            }            
        }
        
        return cells;
    }

    addKeyCell(cells, row_key, row_cfg, cell_row_index) {
        let cell = {};
        cell.key = row_cfg.group_column + cell_row_index;
        cell.data = row_key;
        cells.push(cell);                
    }

    filterColumn(filter, dataArray) {
        let result = dataArray;
        for (const key in filter) {
            result = result.filter(d=> d[key] == filter[key] );            
        }
        return result;
    }

    createGroupRowsMap(row_cfg, array) {
        const result = new Map();

        //where to sort ?????? TODO

        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            let group_field =  row_cfg.group_field;
            let key = element[group_field];
            if (!key) {
                console.log(element, " does'n contain ", group_field, " key");
                continue;
            }
            //key = JSON.stringify(key);    // ??????????
            //console.log(key)
            if ( !result.has(key) )  result.set(key, []);
            result.get(key).push(element);
        }
        return result;
    }

    async getReportCfg(id) {
        const reportConfig = report;    //temp TODO TODO
        return reportConfig;
    }

    async execQueryDatasetMap(cfg, begin, end) {
        const reportConfig = cfg;
        const queryResults = new Map();

        for (let i = 0; i < reportConfig.dataset.length; i++) {
            const item = reportConfig.dataset[i];
            let queryResult = await this.execQueries(item.query, begin, end);
            queryResults.set(item.key, queryResult);
        }
        return queryResults;
    } 

    async execQueries(query, begin, end) {
        let result = [];
        if (Array.isArray(query) ) {
            for (let i = 0; i < query.length; i++) {
                const query_id = query[i];
                let res = await QueryService.exec(query_id, begin, end );                                
                result = [...result, ...res];
            }
        } else {
            let res = await QueryService.exec(query, begin, end);
            result = [...result, ...res];
        }

        //console.log(result)
        return result;
    }
}

module.exports = new ReportNotFixwedRowSetService();