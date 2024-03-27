"use server"

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export default async function query(param) {
    const db = await open({ filename: './database.db', driver: sqlite3.Database })
    try {
        return db.all(param)
    } catch (err) {
        throw new Error(err)
    } finally {
        db.close()
    }
}