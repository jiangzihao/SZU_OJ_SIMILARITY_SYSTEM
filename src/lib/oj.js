'use strict'

let db
require('./db').getDefaultDb().then(conn => { db = conn })

const config = require('../config')
const { compare } = require('./util')

const {
  conn,
  conn: { database },
  tables,
  tables: {
    sim,
    contest,
    problem,
    solution,
    source_code,
    contest_problem
  }
} = config.mysql

for (const key in tables) {
  tables[key] = `${database}.${tables[key]}`
}

exports.getContests = (rows = '*') => {
  return db.query(`select ${rows} from ${contest}`)
}

exports.getContest = (id, rows = '*') => {
  return db.query(`select ${rows} from ${contest} where contest_id=${id}`)
}

exports.getProblems = (rows = '*') => {
  return db.query(`select ${rows} from ${problem}`)
}

exports.getProblem = (id, rows = '*') => {
  return db.query(`select ${rows} from ${problem} where problem_id=${id}`)
}

exports.getContestProblems = (id, rows = '*') => {
  return db.query(`select ${rows} from ${contest_problem} where contest_id=${id}`)
}

exports.getContestSolution = async (id, rows = '*') => {
  const tmpTableName = 'tmp_problems'
  const result = await db.query(`create temporary table ${tmpTableName}(problem_id int,contest_id int);`).then(() => {
    return db.query(`insert into ${tmpTableName} (problem_id,contest_id) select problem_id,contest_id from ${contest_problem} where contest_id=${id};`)
  }).then(() => {
    return db.query(`select ${rows} from ${solution} where problem_id in (select problem_id from ${tmpTableName});`)
  })
  await db.query(`drop table ${tmpTableName}`)
  return result
}

exports.getProblemContests = (id, rows = '*') => {
  return db.query(`select ${rows} from ${contest_problem} where problem_id=${id} and contest_id!=0`)
}

exports.getProblemSolutions = (id, rows = '*') => {
  return db.query(`select ${rows} from ${solution} where problem_id=${id}`)
}

exports.getSolution = (id, rows = '*') => {
  return db.query(`select ${rows} from ${solution} where solution_id=${id}`)
}

exports.getContestProblemSolutions = (cid, pid, rows = '*') => {
  return db.query(`select ${rows} from ${solution} where contest_id=${cid} and problem_id=${pid}`)
}

exports.getSource = (id, rows = '*') => {
  return db.query(`select ${rows} from ${source_code} where solution_id=${id}`)
}

exports.checkSimilarity = async () => {
  const tmpTableName = 'tmp_solutions'
  let maxsid = (await db.query(`select MAX(s_id) from ${sim} where s_id>0`))[0]['MAX(s_id)']
  if (!maxsid) maxsid = 0
  const solutions = (await db.query(`select * from ${solution} where solution_id>${maxsid} and result=4`))
  for (const record of solutions) {
    const id = record['solution_id']
    const pid = record['problem_id']
    const uid = record['user_id']
    console.log(`checking ${id}`)
    const mycode = (await db.query(`select source from ${source_code} where solution_id=${id}`))[0]
    await db.query(`create temporary table if not exists ${tmpTableName} (solution_id int,problem_id int, contest_id int,primary key (solution_id))`)
    await db.query(`insert into ${tmpTableName} (solution_id,problem_id,contest_id) select solution_id,problem_id,contest_id from ${solution} where (problem_id=${pid} and solution_id<${id}) and user_id!='${uid}'`)
    const othersCode = await db.query(`select * from ${source_code} where solution_id in (select solution_id from ${tmpTableName})`)
    const simInfo = {
      sim: 0
    }
    for (const code of othersCode) {
      const sim = compare(mycode.source, code.source)
      if (sim > simInfo.sim) {
        simInfo.id = code.solution_id
        simInfo.sim = sim
        if (sim === 1) break
      }
    }
    if (simInfo.id) {
      console.log(`Find ${simInfo.id}, Similarity: ${simInfo.sim}`)
      await db.query(`insert into ${sim} (s_id,sim_s_id,sim) VALUE (${id},${simInfo.id},${Number.parseInt(simInfo.sim * 100)})`)
    }
    await db.query(`drop table ${tmpTableName}`)
  }
  return db.query(`select * from ${sim}`)
}