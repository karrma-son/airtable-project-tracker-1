
import dotenv from "dotenv";
dotenv.config();

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const TOKEN = process.env.AIRTABLE_API_KEY;



const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;


const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};


//429 error handling --- airtable API is limited to 5 requests per second per base

async function airtableRequest(options, retries = 3, customUrl = url) {
  try {
    const res = await fetch(customUrl, { headers, ...options });   // fetch moved and custom url passed in 

    if (res.status === 429) {
      if (retries === 0) throw new Error("Rate limit exceeded, no retries left");
      const wait = 30000; // will need to wait 30 seconds before subsequent requests will succeed.
      console.warn(`Retrying in ${wait}ms...`);
      await new Promise((r) => setTimeout(r, wait));
      return airtableRequest(options, retries - 1, customUrl)

    }

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(
        `Request failed: ${res.status} ${res.statusText}  - ${JSON.stringify(errorBody)}`
      )
    }

    return res.json();

  } catch (err) {
    console.error('Request error: ', err.message)
    throw err;
  }

};

async function getRecords() {
  const data = await airtableRequest({ method: 'GET' })  //changed to  GET method 
  console.log(JSON.stringify(data, null, 2));
  return data;
}


async function createRecord(fields) {
  const data = await airtableRequest({
    method: 'POST',
    body: JSON.stringify({ fields })
  });
  console.log(JSON.stringify(data, null, 2));
  return data;
}


async function editRecords(records) {
  const data = await airtableRequest({
    method: 'PATCH',
    body: JSON.stringify({ records })
  });

  console.log(JSON.stringify(data, null, 2));
  return data
}


async function deleteRecords(recordIds) {
  const params = recordIds.map((id) => `records[]=${id}`).join("&"); //map through records by id and joins ---- wrap single id in array
  const deleteUrl = `${url}?${params}`;

  const data = await airtableRequest({ method: 'DELETE' }, 3, deleteUrl) //  passes in DELETE method, 3 tires, and deleteUrl custom url
  console.log(JSON.stringify(data, null, 2));
  return data;
}


// createRecord({
//   Name: 'Project_25_add_task',
//   Status: 'To do',
//   Priority: 'High',
//   Assignee: "Tony Anderson",
//   Deadline: '2026-07-14' // use ISO date 
// })

editRecords([
  { id: 'recjAUSDeVmTdgivV', fields: { Status: 'Done' } },
  { id: 'recAbuacP7Lelxyxt', fields: { Status: 'In progress', Priority: 'Low', Assignee: "Tony Anderson" } }
]);

// deleteRecords(['recAbuacP7Lelxyxt'])
// getRecords();