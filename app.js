Papa.parse('data/chavara_gem_final_output_no_phd.csv',{download:true,header:true,
complete:r=>console.log('Rows:',r.data.length)});