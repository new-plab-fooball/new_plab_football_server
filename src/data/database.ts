const mysql =  require('mysql2');

const pool = mysql.createPool({
  host: 'toy-squad.c5rdqt8esadj.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  user: 'toy_squad_sjw',
  database: 'toy_squad_sjw',
  password: 'fkdlvmf42%%',
});

export const db = pool.promise();

export const sql_key_generater = (
  keys_array: string[],
  type: 'insert' | 'select'
) => {
  const select_array = Array.isArray(keys_array)
    ? keys_array
    : Object.keys(keys_array);
  if (type === 'insert') return `(${select_array.join(', ')})`;
  else if (type === 'select') return `${select_array.join(', ')}`;
};

export const sql_value_generater = (values_arr: string[]) => {
  return `(${Object.values(values_arr)
    .map((el) => {
      return typeof el === 'string' ? `'${el}'` : el;
    })
    .join(',')})`;
};

export const sql_update_query = (update_obj: {}) => {
  const key_arr: string[] = Object.keys(update_obj);
  const value_arr: string[] = Object.values(update_obj);
  const answer: string[] = [];
  for (let i = 0; i < key_arr.length; i++) {
    answer.push(
      `${key_arr[i]}=${
        typeof value_arr[i] === 'string' ? `'${value_arr[i]}'` : value_arr[i]
      }`
    );
  }
  return answer.join(' , ');
};

export const sql_join_query = (join_obj: any, ons: string[]) => {
  const answer = [];
  let join_qurey = `FROM ${Object.keys(join_obj)[0]} `;
  for (let i = 0; i < Object.keys(join_obj).length; i++) {
    for (let j = 0; j < join_obj[Object.keys(join_obj)[i]].length; j++) {
      answer.push(
        `${Object.keys(join_obj)[i]}.${
          join_obj[Object.keys(join_obj)[i]][j]
        } as ${
          Object.keys(join_obj)[i] + '_' + join_obj[Object.keys(join_obj)[i]][j]
        }`
      );
    }
  }
  for (let i = 1; i < Object.keys(join_obj).length; i++) {
    join_qurey += `LEFT JOIN ${Object.keys(join_obj)[i]} ON ${ons[0]} = ${
      ons[i]
    } `;
  }
  return [answer.join(' , '), join_qurey];
};

export const createDataBase = (table_name: string, to_db: any) => {
  const keysQuery = sql_key_generater(to_db, 'insert');
  const valuestQuery = sql_value_generater(to_db);
  return db.execute(
    `INSERT INTO ${table_name} ${keysQuery} VALUES ${valuestQuery}`
  );
};

export const readDataBase = (
  table_name: string,
  to_db: string[] | 'all',
  where?: string | null,
  limit?: string
) => {
  return db.execute(
    `SELECT ${
      typeof to_db === 'object'
        ? sql_key_generater(to_db, 'select')
        : to_db === 'all' && '*'
    } FROM ${table_name} 
    ${where ? `WHERE ${where}` : ''} 
    ${limit ? `LIMIT ${limit}` : ''}`
  );
};

export const readDataBaseJoin = (
  to_db: any,
  ons: string[],
  where?: string | null
) => {
  const join_query = sql_join_query(to_db, ons);
  return db.execute(`SELECT ${join_query[0]} ${join_query[1]} WHERE ${where}`);
};

export const updateDataBase = (
  table_name: string,
  update_obj: {},
  where: string
) => {
  return db.execute(
    `UPDATE ${table_name} SET ${sql_update_query(update_obj)} WHERE ${where}`
  );
};

export const deleteDataBase = (table_name: string, where: string) => {
  return db.execute(`DELETE  FROM ${table_name} WHERE ${where}`);
};
