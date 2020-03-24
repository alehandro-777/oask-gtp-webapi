
exports.createMrinVtvModel = (mongoose) =>{
    let VtVpsg = new mongoose.Schema({
        dks: Number,
        fuel: Number,
        psg: Number
    });

    let schema = new mongoose.Schema({
        lastupdate : { type: Date , default: Date.now},
        day_in:{
            mrin : VtVpsg,
            olishevka : VtVpsg,
            solokha : VtVpsg,
        },
        day_out:{
            mrin : VtVpsg,
            olishevka : VtVpsg,
            solokha : VtVpsg,
        },
        day_total:{
            mrin : VtVpsg,
            olishevka : VtVpsg,
            solokha : VtVpsg,
        },
        mon_in:{
            mrin : VtVpsg,
            olishevka : VtVpsg,
            solokha : VtVpsg,
        },
        mon_out:{
            mrin : VtVpsg,
            olishevka : VtVpsg,
            solokha : VtVpsg,
        },
        mon_total:{
            mrin : VtVpsg,
            olishevka : VtVpsg,
            solokha : VtVpsg,
        }
    });
    
    let model = mongoose.model('VtvMrinDay', schema);
    return model;
}

exports.createRegimPSGModel = (mongoose) =>{
    
    let PSGRegim = new mongoose.Schema({
        date : { type: Date , default: Date.now},
        key : String,
        model : String,
        hour : Number,
        q_in: Number,
        q_out: Number,
        num_lines: Number
    });
    
    let DksRegim = new mongoose.Schema({
        date : { type: Date , default: Date.now},
        key : String,
        model : String,
        hour : Number,
        p_in: Number,
        p_out: Number,
        e: { type: Number , default: 1.0},
        num_gpa: Number
    });  

    let DksRegimRow = new mongoose.Schema({
            time: String,
            q_in_total_ogsu: { type: Number , default: 10.0},
            q_out_total_ogsu: { type: Number , default: 20.0},
            q_in_total_vupzg: { type: Number , default: 0.0},
            q_out_total_vupzg: { type: Number , default: 0.0},
            kc_bobrovnitska_05 : DksRegim,
            kc_mrin : DksRegim,
            psg_red_partizanen : PSGRegim,
            kc_solokha : DksRegim,
            psg_solokha : PSGRegim,
            kc_olishevka : DksRegim,
            psg_olishevka : PSGRegim
    });

    let schema = new mongoose.Schema({
        lastupdate : { type: Date , default: Date.now},
        created_at : { type: Date , default: Date.now},
        rows:[DksRegimRow],                                 //index - contract hour
        total_row : DksRegimRow
    });
    

    schema.methods.calc_total_row = function () {
        if (!this.total_row) {
            this.total_row  = new model_rg_dks_row();
        }
        sum_column.call(this, "q_in_total_ogsu");
        sum_column.call(this, "q_out_total_ogsu");
        sum_column.call(this, "q_in_total_vupzg");
        sum_column.call(this, "q_out_total_vupzg");

        function sum_column(column_name) {
            this.total_row[column_name] = this.rows.reduce((sum, current)=> {
                if (!current) return sum;
                return sum + current[column_name]; 
            }, 0);
        }
    }
    schema.methods.set_regim_cell = function (mongoose_value_object) {

        if (!this.rows[mongoose_value_object.hour]) {
            this.rows[mongoose_value_object.hour] = new model_rg_dks_row({"time": `${mongoose_value_object.hour}-00`});
        } 

        this.rows[mongoose_value_object.hour][mongoose_value_object.key] = mongoose_value_object;    
    }


    let model_rg_psg = mongoose.model('PsgRegim', PSGRegim);
    let model_rg_dks = mongoose.model('DksRegim', DksRegim);
    let model_rg_dks_row = mongoose.model('DksRegimRow', DksRegimRow);
    let model = mongoose.model('RegimMrinPSGDay', schema);  

    return model;
}

exports.createDayBallanceMrinModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        lastupdate : { type: Date , default: Date.now},
        created_at : { type: Date , default: Date.now},
        cols:[{
            begin : { type: Date , default: Date.now},
            end : { type: Date , default: Date.now},
            q_in_mrin: Number,
            q_out_mrin: Number,
            q_in_solokha: Number,
            q_out_solokha: Number,
            q_in_olishevka: Number,
            q_out_olishevka: Number,
        }],
        last_day:{
            time : { type: Date , default: Date.now},
            hour : Number,
            q_in_mrin: Number,
            q_out_mrin: Number,
            q_in_solokha: Number,
            q_out_solokha: Number,
            q_in_olishevka: Number,
            q_out_olishevka: Number,
        },
        month:{
            time : { type: Date , default: Date.now},
            hour : Number,
            q_in_mrin: Number,
            q_out_mrin: Number,
            q_in_solokha: Number,
            q_out_solokha: Number,
            q_in_olishevka: Number,
            q_out_olishevka: Number,
        },

        ogtsu_cols:[{
            begin : { type: Date , default: Date.now},
            end : { type: Date , default: Date.now},
            q_in_mrin: Number,
            q_out_mrin: Number,
            q_in_solokha: Number,
            q_out_solokha: Number,
            q_in_olishevka: Number,
            q_out_olishevka: Number,
        }],
        ogtsu_last_day:{
            time : { type: Date , default: Date.now},
            hour : Number,
            q_in_mrin: Number,
            q_out_mrin: Number,
            q_in_solokha: Number,
            q_out_solokha: Number,
            q_in_olishevka: Number,
            q_out_olishevka: Number,
        },
        ogtsu_month:{
            time : { type: Date , default: Date.now},
            hour : Number,
            q_in_mrin: Number,
            q_out_mrin: Number,
            q_in_solokha: Number,
            q_out_solokha: Number,
            q_in_olishevka: Number,
            q_out_olishevka: Number,
        },

    });
    
    let model = mongoose.model('BallanceMrinPSGDay', schema);
    return model;
}

exports.createEventHistoryModel = (mongoose) =>{
    let schema = new mongoose.Schema({
        _id: Number,        //valve object id
        history :[{
            state: String,
            value: Number,   
            lastupdate : { type: Date , default: Date.now}, 
        }],
    });
    
    let model = mongoose.model('ObjectEvent', schema);
    return model;
}

exports.createPvvgDayModel = (mongoose) =>{
    let Data_schema = new mongoose.Schema({
        hour: Number,           //hour number
        hour_offset: Number,    //offset, coz hour is not unique
        p: Number,
        t: Number,
        dp: Number,
        q: Number,
        lastupdate : { type: Date , default: Date.now} 
    });

    let schema = new mongoose.Schema({
        lastupdate : { type: Date , default: Date.now},
        created_at : { type: Date , default: Date.now},
        hours : [{}],    //index - hour + offset
        total_row : Data_schema
    });

    function calc_total() {
        sum_column("q");
        avg_column("p");
        avg_column("t");
        max_column("dp");
        max_column("lastupdate");
    }

    function sum_column(column_name) {
        this.total_row[column_name] = this.hours.filter(el=> el !== null).reduce((sum, current)=> {
            return sum + current[column_name]; 
        }, 0);
    }
    function avg_column(column_name) {
        let temp_arr = this.hours.filter(el=> el !== null);
        this.total_row[column_name] = temp_arr.reduce((sum, current)=> {
            return sum + current[column_name]; 
        }, 0) / temp_arr.length;
    }
    function max_column(column_name) {
        this.total_row[column_name] = this.hours.filter(el=> el !== null).reduce((sum, current)=> {
            return (sum < current[column_name]) ? current[column_name] : sum; 
        }, 0);
    }

    let data_model = mongoose.model('FloTecHourRec', Data_schema);
    let model = mongoose.model('PvvgDayReport', schema);

    return model;
}