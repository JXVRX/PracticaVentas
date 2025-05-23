import { db } from '../config/db.js';

export const registrarVenta = (venta, callback) => {
    const {id_cliente, id_producto, cantidad} = venta;
    db.query('select precio, stock from prodcutos where id = ?', [id_producto], (err, result) => {
        if(err) return callback(err);
        if(result.length === 0) {
            return callback (new Error('Producto no encontrado'));
        }
        const {precio, stock} = results [0];
        if (cantidad > stock) {
            return callback(new Error('Stock insuficiente'));
        }
        const total = precio * cantidad;
        db.query('insert into ventas (id_cliente, id_producto, cantidad, precioUnitario, total) values (?, ?, ?, ?, ?)', [id_cliente, id_producto, cantidad, precio, total], (err, resultado) => {
            if (err) return callback(err);
            db.query('update productos set stock = stock - ? where id = ?', [cantidad, id_producto], (err2) => {
                if (err2) return callback(err2);
                callback(null, resultado);
            });
        }
    );
    });
};

export const obtenerVentas = (callback) => {
    db.query(`
        select v.id, c.nombre as cliente, p.nombre_prod as producto,
        v.cantidad, v.precio_unitario, v.total, v.fecha
        from ventas v
        join clientes c on v.id_cliente = c.id
        join productos p on v.id_producto = p.id
        orden by v.fecha desc
        `, (err, results) => {
            if (err) return callback(err);
            callback(null, result);
        });
};