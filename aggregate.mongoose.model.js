
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
        q_in: Number,
        q_out: Number,
        num_lines: Number
    });
    
    let DksRegim = new mongoose.Schema({
        p_in: Number,
        p_out: Number,
        e: Number,
        num_gpa: Number
    });  


    let schema = new mongoose.Schema({
        lastupdate : { type: Date , default: Date.now},
        created_at : { type: Date , default: Date.now},
        rows:[{
            hour : Number,
            q_in_total_ogsu: Number,
            q_out_total_ogsu: Number,
            q_in_total_vupzg: Number,
            q_out_total_vupzg: Number,
            kc_bobrovnitska_05 : DksRegim,
            kc_mrin : DksRegim,
            psg_red_partizanen : PSGRegim,
            kc_solokha : DksRegim,
            psg_solokha : PSGRegim,
            kc_olishevka : DksRegim,
            psg_olishevka : PSGRegim
        }],
        total_row:{
            q_in_total_ogsu: Number,
            q_out_total_ogsu: Number,
            q_in_total_vupzg: Number,
            q_out_total_vupzg: Number,
            kc_bobrovnitska_05 : DksRegim,
            kc_mrin : DksRegim,
            psg_red_partizanen : PSGRegim,
            kc_solokha : DksRegim,
            psg_solokha : PSGRegim,
            kc_olishevka : DksRegim,
            psg_olishevka : PSGRegim
        }
    });
    
    let model_rg_psg = mongoose.model('RegimPsg', PSGRegim);
    let model_rg_dks = mongoose.model('RegimDks', DksRegim);
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