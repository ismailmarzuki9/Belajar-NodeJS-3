import { DatabaseSync } from "node:sqlite";
const db = new DatabaseSync('catuangku.db');

// console.log('data berhasil di buka',db);
// db.pragma('foreign_keys = ON'); // untuk mengaktifkan pemeriksaan foreign_keys
db.exec('PRAGMA foreign_keys= ON '); // untuk mengaktifkan pemeriksaan foreign_keys

// create table
db.exec(`
                CREATE TABLE  IF NOT EXISTS users  (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                uuid TEXT UNIQUE NOT NULL,
                nama_user TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT DEFAULT 'User',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `);

db.exec(`
        CREATE TABLE  IF NOT EXISTS transaksi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE NOT NULL,
            user_uuid TEXT,
            nama_transaksi TEXT,
            type TEXT CHECK (type IN ('debit', 'kredit')),
            nominal INTEGER NOT NULL,
            keterangan TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_uuid)
                REFERENCES users(uuid)
        );
    `)

// INSERT USERS

// const statementUser = db.prepare(`
//     INSERT INTO users (
//         uuid,
//         nama_user,
//         password,
//         role
//     )
//     VALUES
//         (?,?,?,?),
//         (?,?,?,?),
//         (?,?,?,?),
//         (?,?,?,?),
//         (?,?,?,?)
// `);

// const resultUser = statementUser.run(
//     '550e8400-e29b-41d4-a716-446655440001',
//     'Budi Santoso',
//     'hashed_password_001',
//     'User',

//     '550e8400-e29b-41d4-a716-446655440002',
//     'Andi Pratama',
//     'hashed_password_002',
//     'User',

//     '550e8400-e29b-41d4-a716-446655440003',
//     'Citra Lestari',
//     'hashed_password_003',
//     'User',

//     '550e8400-e29b-41d4-a716-446655440004',
//     'Dimas Saputra',
//     'hashed_password_004',
//     'Admin',

//     '550e8400-e29b-41d4-a716-446655440005',
//     'Eka Putri',
//     'hashed_password_005',
//     'User'
// );

// console.log('User berhasil dimasukkan:', resultUser.changes);

// // INSERT TRANSAKSI
// const statementTrx = db.prepare(`
//     INSERT INTO transaksi (
//         uuid,
//         user_uuid,
//         nama_transaksi,
//         type,
//         nominal,
//         keterangan
//     )
//     VALUES
//         (?,?,?,?,?,?),
//         (?,?,?,?,?,?),
//         (?,?,?,?,?,?),
//         (?,?,?,?,?,?),
//         (?,?,?,?,?,?)
// `);

// const resultTrx = statementTrx.run(
//     '660e8400-e29b-41d4-a716-446655440001',
//     '550e8400-e29b-41d4-a716-446655440001',
//     'Gaji',
//     'kredit',
//     5000000,
//     'Gaji bulanan',

//     '660e8400-e29b-41d4-a716-446655440002',
//     '550e8400-e29b-41d4-a716-446655440001',
//     'Makan siang',
//     'debit',
//     35000,
//     'Makan siang di kantor',

//     '660e8400-e29b-41d4-a716-446655440003',
//     '550e8400-e29b-41d4-a716-446655440002',
//     'Transportasi',
//     'debit',
//     50000,
//     'Biaya transportasi',

//     '660e8400-e29b-41d4-a716-446655440004',
//     '550e8400-e29b-41d4-a716-446655440003',
//     'Freelance',
//     'kredit',
//     750000,
//     'Pendapatan freelance',

//     '660e8400-e29b-41d4-a716-446655440005',
//     '550e8400-e29b-41d4-a716-446655440004',
//     'Belanja',
//     'debit',
//     250000,
//     'Belanja kebutuhan rumah'
// );

// console.log('Transaksi berhasil dimasukkan:', resultTrx.changes);

// SELECT USERS
const selectUser = db.prepare('SELECT * FROM users');
// console.log('Data users:', selectUser.all());

// SELECT TRANSAKSI
const selectTrx = db.prepare('SELECT * FROM transaksi');
// console.log('Data transaksi:', selectTrx.all());

const statementTrx_Post = db.prepare(`
                                INSERT INTO transaksi (
                                    uuid,
                                    user_uuid,
                                    nama_transaksi,
                                    type,
                                    nominal,
                                    keterangan
                                )
                                VALUES
                                    (
                                    @uuid,
                                    @user_uuid,
                                    @nama_transaksi,
                                    @type,
                                    @nominal,
                                    @keterangan
                                    )
                            `);

db.prepare('SELECT 1 AS tes').get();
// db.close();

// export default{ db, selectTrx }; // Kalau ingin mengekspor object database,
export { db, selectTrx, statementTrx_Post,};