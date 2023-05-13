const express = require('express')
const { Pool} = require('pg')

const pool = new Pool({
  user: 'abid',
  database: 'clinic',
  password: '1aabid123',
  port: 5432,
  host: 'localhost',
})



// console.log(pool)
module.exports = {pool}