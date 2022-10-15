const QueryService = require('./query')

// fixed row set !!!
class ReportService {
    
    //create excel cells
    async create(report_cfg, begin, end) {
        //query all data
        let dataMap = await this.execQueryDatasetMap(report_cfg, begin, end);
        let cells = [];

        //create cells
        //iterate columns config
        for (let i = 0; i < report_cfg.columns.length; i++) {

            let col_cfg = report_cfg.columns[i];
            let ds_key = col_cfg.dataset;
            let col_key = col_cfg.key;
            let data_set = dataMap.get(ds_key);
            let col_data_arr = this.filterColumn(col_cfg.filter, data_set);
            
            //iterate rows config
            for (let j = 0; j < report_cfg.rows.length; j++) {
                let cell = {};

                const row_cfg = report_cfg.rows[j];
                let row_key =  row_cfg.key;

                let cell_data_arr = this.filterCell(col_key, row_cfg, col_data_arr);

                cell = this.updateCell(cell, col_cfg, col_key, row_key, cell_data_arr);

                //console.log(cell);
                cells.push(cell);
            }
            
        }
        return cells;
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
            let queryResult = await QueryService.exec(item.query, begin, end);
            queryResults.set(item.key, queryResult);
        }

        return queryResults;
    } 

    filterColumn(filter, dataArray) {
        let result = dataArray;
        for (const key in filter) {
            result = result.filter(d=> d[key] == filter[key] );
        }
        return result;
    }

    filterCell(col_key, row_cfg, dataArray) {
        let result = [];
        let filter = row_cfg[col_key];
        for (const key in filter) {
            result = dataArray.filter(d=> d[key] == filter[key] );
        }
        return result;
    }

    updateCell(cell, col_cfg, col_key, row_key, cell_data) {
        cell.key = col_key + row_key;
        cell.data = null;

        if (cell_data.length == 0) return cell;

        cell.data = cell_data[0][col_cfg.cell_field];

        return cell;
    }
}

module.exports = new ReportService();