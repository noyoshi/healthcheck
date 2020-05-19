const si = require("systeminformation");
const bytes = require("bytes");
const fetch = require('node-fetch');


let parse_mem_data = data => {
  return {
    total: bytes(data.total),
    available: bytes(data.used),
    active: bytes(data.active),
  };
};

let filter_load = data => {
  return {
    all: data.cpus.map(cpu => {
      return `${Math.round(cpu.load)}%`;
    }),
    current: `${Math.round(data.currentLoad)}%`
  };
};

let filter_procs = data => {
  return {
    data: data.list.map(proc => {
      return {
        user: proc.user,
        mem: proc.pmem,
        name: proc.name,
        state: proc.state,
        cmd: proc.command,
        cpu: proc.pcpu
      };
    })
  };
};

si.processes().then(data => console.log(filter_procs(data).length));
si.currentLoad().then(data => console.log(filter_load(data)));

// Send the data to an external server (e.g. my laptop) every X seconds
DESTINATION_URL = "http://0.0.0.0:6000/receiver";


async function send_data() {
  si.mem().then(data => {
    si.processes().then(proc_data => {
      si.currentLoad().then(load_data => {
        filtered_procs = filter_procs(proc_data);
        payload = {
          mem: parse_mem_data(data),
          load: filter_load(load_data),
          num_procs: filtered_procs.data.length
        }
        fetch(DESTINATION_URL, { 
          method: "POST", 
          body: JSON.stringify(payload),
          headers:  { 'Content-Type': 'application/json' }
        })
          .then(res => res.json())
          .then(json_msg => console.log(json_msg))
          .catch(err => console.log(err));
      });
    });
  });
};

setInterval(send_data, 1000);
