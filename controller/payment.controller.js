let mdTransaction = require('../model/transaction.modal');
var moment = require('moment')

exports.listPayment = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let sortOption=null;
    let filterSearch = null;
    let currentPage = parseInt(req.query.page) || 1;
    let totalOfTotal3 = 0;
    let totalOfTotal4 = 0;
    let totalOfFee3 = 0;
    let totalOfFee4= 0;
    let totalOfProfit3 = 0;
    let totalOfProfit4 = 0;
    const selectedInterval = req.query.interval;
    if (req.method == 'GET') {
        try {
            if (typeof (req.query.filterSearch) !== 'undefined' && (req.query.filterSearch.trim()) !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = {
                    ...filterSearch,
                    $or: [
                        { fullName: new RegExp(searchTerm, 'i') }, // Add this condition for fullName search
                        // Other conditions you have
                    ]
                };
            }
            

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { nameProduct: req.query.sortOption };
            }
     
            const totalCount = await mdTransaction.TransactionModal.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listPayment = await mdTransaction.TransactionModal.find(filterSearch).populate('idCustommer').populate('idBill')
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);
            console.log(listPayment.length);

            filterSearch = {
                ...filterSearch,
                $or: [
                    { status: -1 },
                    { status: 0 },
                    { status: 1 },
                    { status: 3 },
                    { status: 4 }
                ]
            };

        let startDate, endDate;
        // Calculate the start and end dates based on the selected interval
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
        
        const totalStatusMinusOne = await mdTransaction.TransactionModal.countDocuments({ ...filterSearch, status: -1, createAt: { $gte: startDate, $lte: endDate } });
        const totalStatusZero = await mdTransaction.TransactionModal.countDocuments({ ...filterSearch, status: 0, createAt: { $gte: startDate, $lte: endDate } });
        const totalStatusOne = await mdTransaction.TransactionModal.countDocuments({ ...filterSearch, status: 1, createAt: { $gte: startDate, $lte: endDate } });
       
        const paymentsInInterval3 = await mdTransaction.TransactionModal.find({         
            createAt: { $gte: startDate, $lte: endDate }
        });
        const paymentsInInterval4 = await mdTransaction.TransactionModal.find({
            ...filterSearch, status: 4 ,
            createAt: { $gte: startDate, $lte: endDate }
        });


        paymentsInInterval3.forEach(payment => {
            totalOfTotal3 += payment.total;
            totalOfFee3 += payment.fee;
        });

        totalOfProfit3 = totalOfTotal3 - totalOfFee3;

        paymentsInInterval4.forEach(payment => {
            totalOfTotal4 += payment.total;
            totalOfFee4 += payment.fee;
        });

         totalOfProfit4 = totalOfTotal4 - totalOfFee4;
               
                console.log("doanh thu" + totalOfTotal3);
                console.log("doanh thu thuc" + totalOfTotal4);
 console.log("loi nhuan" + totalOfProfit3);
 console.log("loi nhuan thuc" + totalOfProfit4);
            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('Payment/payment', {
                listPayment: listPayment,
                countNowProduct: listPayment.length,
                countAllProduct: totalCount,
                totalStatusMinusOne: totalStatusMinusOne,
                totalStatusZero: totalStatusZero,
                totalStatusOne: totalStatusOne,
                totalOfTotal3:totalOfTotal3,
                totalOfTotal4:totalOfTotal4,
                totalOfProfit3:totalOfProfit3,
                totalOfProfit4:totalOfProfit4,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách sản phẩm: ' + msg);
        }
    }

    // If no search results are found, render a message
    res.render('Payment/payment', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
};

exports.detailPayment = async (req, res, next) => {
    const perPage = 7;
    let msg = '';
    let sortOption=null;
    let filterSearch = null;
    let currentPage = parseInt(req.query.page) || 1;
    let idTransaction=req.params.idTransaction

    if (req.method == 'GET') {
        try {
            if (typeof req.query.filterSearch !== 'undefined' && req.query.filterSearch.trim() !== '') {
                // Use a regex to match any username containing the search input character(s)
                const searchTerm = req.query.filterSearch.trim();
                filterSearch = { nameProduct: new RegExp(searchTerm, 'i') };
            }

            if (typeof (req.query.sortOption) != 'undefined') {
                sortOption = { nameProduct: req.query.sortOption };
            }
     
            const totalCount = await mdTransaction.TransactionModal.countDocuments(filterSearch);
            const totalPages = Math.ceil(totalCount / perPage);

            // Validate the current page number to stay within the correct range
            if (currentPage < 1) currentPage = 1;
            if (currentPage > totalPages) currentPage = totalPages;

            const skipCount = (currentPage - 1) * perPage;
            let listDetailPayment = await mdTransaction.TransactionModal.findById(idTransaction).populate('idCustommer').populate('idBill').
            populate({path:"idBill",populate:{
                path:"products.idProduct"
            }})
                .sort(sortOption)
                .skip(skipCount)
                .limit(perPage);
            // console.log(listDetailPayment);
            console.log("abcxyz" +listDetailPayment.idBill.locationDetail);
            console.log("custommer" + totalCount)

           
            msg = 'Lấy danh sách  sản phẩm thành công';
            return res.render('Payment/paymentDetail', {
                listDetailPayment: listDetailPayment,
                countNowProduct: listDetailPayment.length,
                countAllProduct: totalCount,
                msg: msg,
                currentPage: currentPage,
                totalPages: totalPages,
                moment: moment
            });
        } catch (error) {
            msg = '' + error.message;
            console.log('Không lấy được danh sách sản phẩm: ' + msg);
        }
    }

    // If no search results are found, render a message
    res.render('Payment/paymentDetail', {
        msg: 'Không tìm thấy kết quả phù hợp',
        moment: moment
    });
}