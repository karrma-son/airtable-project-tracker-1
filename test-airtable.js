
import dotenv from "dotenv";
dotenv.config();

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const TOKEN = process.env.AIRTABLE_API_KEY;



const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

async function test() {
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const data = await res.json();

  console.log(JSON.stringify(data, null, 2));
}




async function createRecord() {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        Name: 'Project_25_add_task',
        Status: 'To do',
        Priority: 'High',
        Assignee: "Tony Anderson",
        Deadline: '2026-07-14' // use ISO date 

      }
    })
  });


  const data = await res.json();
  console.log(JSON.stringify(data, null, 2))
}


async function editRecords() {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type':  'application/json'
      
    },
    body: JSON.stringify({
      records: [
        { id: 'recjAUSDeVmTdgivV', fields: { Status: 'Done' } },
        { id: 'reckXguCbW3Oh5rzc', fields: { Status: 'In progress', Priority: 'Low', Assignee: "Tony Anderson" } }
      ]
    })
  })

  const data = await res.json();
  console.log(JSON.stringify(data, null, 2))
}

editRecords();