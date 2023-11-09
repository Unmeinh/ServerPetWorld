let mdTransaction = require('../model/transaction.modal');
var moment = require('moment')

exports.listPayment = async (req, res, next) => {
    let msg = '';
    const selectedInterval = req.query.interval;
    let startDate, endDate;
    const perPage = 7; 
    let currentPage = parseInt(req.query.page) || 1; 
    const fullName = req.body.fullName;
    
    if (req.method == 'GET') {
        try {
      
            if (selectedInterval === 'today') {
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
            } else if (selectedInterval === 'week') {
                const currentDate = new Date();
                startDate = new Date(currentDate);
                startDate.setHours(0, 0, 0, 0);
                startDate.setDate(currentDate.getDate() - 7);
                endDate = new Date(currentDate);
                endDate.setHours(23, 59, 59, 999);
            } else if (selectedInterval === 'month') {
                const currentDate = new Date();
                startDate = new Date(currentDate);
                startDate.setHours(0, 0, 0, 0);
                startDate.setMonth(currentDate.getMonth() - 1);
                endDate = new Date(currentDate);
                endDate.setHours(23, 59, 59, 999);
            } else if (selectedInterval === 'year') {
                const currentDate = new Date();
                startDate = new Date(currentDate.getFullYear() - 1, 0, 1);
                endDate = new Date(currentDate);
                endDate.setHours(23, 59, 59, 999);
            }

            if(fullName){
                aggregationPipeline = [                           
                    {
                        $match: {
                            $or: [
                                { status: -1 },
                                { status: 0 },
                                { status: 1 },
                                { status: 3 },
                                { status: 4 },
                            ],
                            // $or: [
                            //     { "idCustommer": { $eq: fullName } }, 
                            // ],
                            createAt: { $gte: startDate, $lte: endDate },
                        }
                    },
                    {
                        $lookup: {
                            from: "User", 
                            localField: "idCustommer",
                            foreignField: "_id",
                            as: "customer"
                        }
                    }, 
                    {
                        $lookup: {
                            from: "billProducts", 
                            localField: "idBill",
                            foreignField: "_id",
                            as: "bill"
                        }
                    },                   
                    {
                        $group: {
                            _id:null,
                            listPayment: { $push: "$$ROOT" },
                            totalOfTotal3: { $sum: "$total" },
                            totalOfTotal4: { $sum: { $cond: { if: { $eq: ["$status", 4] }, then: "$total", else: 0 } } },
                            totalOfFee3: { $sum: "$fee" },
                            totalOfFee4: { $sum: { $cond: { if: { $eq: ["$status", 4] }, then: "$fee", else: 0 } } },
                            totalPayments: { $sum: 1 },
                            totalStatusMinusOne: {
                                $sum: { $cond: { if: { $eq: ["$status", -1] }, then: 1, else: 0 } }
                            },
                            totalStatusZero: {
                                $sum: { $cond: { if: { $eq: ["$status", 0] }, then: 1, else: 0 } }
                            },
                            totalStatusOne: {
                                $sum: { $cond: { if: { $eq: ["$status", 1] }, then: 1, else: 0 } }
                            }
                        }
                    },
                    {
                        $project: {
                          totalOfTotal3: 1,
                          totalOfTotal4: 1,
                          totalOfFee3: 1,
                          totalOfFee4: 1,
                          totalPayments: 1,
                          totalStatusMinusOne: 1,
                          totalStatusZero: 1,
                          totalStatusOne: 1,
                          "listPayment._id":1,
                          "listPayment.idBill":1,                        
                          "listPayment.status":1,
                          "listPayment.total":1,
                          "listPayment.fee":1,
                          "listPayment.paymentMethod":1,
                          "listPayment.createAt":1,
                          "listPayment.customer.fullName":1,
                          "listPayment.bill.products":1,
                          
                        },
                    },
                    
                    
                ];
            }else{
                aggregationPipeline = [
                    {
                        $match: {
                            $or: [
                                { status: -1 },
                                { status: 0 },
                                { status: 1 },
                                { status: 3 },
                                { status: 4 }
                            ],
                            createAt: { $gte: startDate, $lte: endDate },
                        }
                    },
                    {
                        $lookup: {
                            from: "User",
                            localField: "idCustommer",
                            foreignField: "_id",
                            as: "customer"
                        }
                        
                    },
                    {
                        $lookup: {
                            from: "billProducts", 
                            localField: "idBill",
                            foreignField: "_id",
                            as: "bill"
                        }
                    },
                   
                    {
                        $group: {
                            _id: null,
                            listPayment: { $push: "$$ROOT" },
                            totalOfTotal3: { $sum: "$total" },
                            totalOfTotal4: { $sum: { $cond: { if: { $eq: ["$status", 4] }, then: "$total", else: 0 } } },
                            totalOfFee3: { $sum: "$fee" },
                            totalOfFee4: { $sum: { $cond: { if: { $eq: ["$status", 4] }, then: "$fee", else: 0 } } },
                            totalPayments: { $sum: 1 },
                            totalStatusMinusOne: {
                                $sum: { $cond: { if: { $eq: ["$status", -1] }, then: 1, else: 0 } }
                            },
                            totalStatusZero: {
                                $sum: { $cond: { if: { $eq: ["$status", 0] }, then: 1, else: 0 } }
                            },
                            totalStatusOne: {
                                $sum: { $cond: { if: { $eq: ["$status", 1] }, then: 1, else: 0 } }
                            }
                        }
                    },
                    {
                        $project: {
                          totalOfTotal3: 1,
                          totalOfTotal4: 1,
                          totalOfFee3: 1,
                          totalOfFee4: 1,
                          totalPayments: 1,
                          totalStatusMinusOne: 1,
                          totalStatusZero: 1,
                          totalStatusOne: 1,
                          "listPayment._id":1,
                          "listPayment.idCustommer":1,
                          "listPayment.idBill":1,                        
                          "listPayment.status":1,
                          "listPayment.total":1,
                          "listPayment.fee":1,
                          "listPayment.paymentMethod":1,
                          "listPayment.createAt":1,
                          "listPayment.customer.fullName":1,
                          "listPayment.bill.products.idProduct":1,
                          
                 
                        },
                    },
                    
                    
                ];
            }

            const results = await mdTransaction.TransactionModal.aggregate(aggregationPipeline);          
            if (results.length === 0) {          
                return res.render('Transaction/transaction', {
                    message: "Hôm nay không có đơn hàng nào cả.",
                    moment: moment,
                    adminLogin:req.session.adLogin
                });
            }
            const {totalOfTotal3, totalOfTotal4, totalOfFee3, totalOfFee4,totalStatusMinusOne,totalStatusZero,totalStatusOne } = results[0];
            const totalPayments = results[0].totalPayments;
            const totalPages = Math.ceil(totalPayments / perPage);

            const startIndex = (currentPage - 1) * perPage;
            const endIndex = currentPage * perPage;
            const listPayment = results[0].listPayment.slice(startIndex, endIndex);
    
            return res.render('Transaction/transaction', {
                listPayment: listPayment,
                countNowProduct: listPayment.length,
                countAllProduct: totalPayments,
                totalPages: totalPages,
                currentPage: currentPage,
                totalStatusMinusOne: totalStatusMinusOne,
                totalStatusZero: totalStatusZero,
                totalStatusOne: totalStatusOne,
                totalOfTotal3: totalOfTotal3,
                totalOfTotal4: totalOfTotal4,
                totalOfFee3: totalOfFee3,
                totalOfFee4: totalOfFee4,
                totalOfProfit3: totalOfTotal3 - totalOfFee3,
                totalOfProfit4: totalOfTotal4 - totalOfFee4,
                selectedInterval: selectedInterval,
                perPage:perPage,
                msg: msg,
                moment: moment,
                adminLogin:req.session.adLogin
            });
           
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách sản phẩm: ' + msg);
        }
    }
};




exports.detailPayment = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let currentPage = parseInt(req.query.page) || 1;
    const skip = (currentPage - 1) * perPage;
    const limit = perPage;
    let idTransaction=req.params.idTransaction


    if (req.method == 'GET') {
        try {
            
            let listDetailPayment = await mdTransaction.TransactionModal.findById(idTransaction)
            .populate('idCustommer')
            .populate('idBill')
            .populate({
                path: "idBill",
                populate: {
                    path: "products.idProduct",
                    model: 'ProductModel'
                }
            })
            .skip(skip)
            .limit(limit);
            
            const totalCount = listDetailPayment.idBill.products.length;
            const totalPages = Math.ceil(totalCount / perPage);        
        
            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('Transaction/transactionDetail', {
                listDetailPayment: listDetailPayment,
                countNowProduct: listDetailPayment.idBill.products.length,
                countAllProduct: listDetailPayment.idBill.products.length,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment,
                adminLogin: req.session.adLogin
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách sản phẩm: ' + msg);
        }
        
    }

    res.render('Transaction/transactionDetail', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment,
        adminLogin: req.session.adLogin
    });
}