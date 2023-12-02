import clsx from "clsx"
import style from "./OrderList.module.scss"
import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import Order from "../Order";


function OrderList(props) {

    const [allOrdersList, setAllOrdersList] = useState([]);
    const [orderList, setOrderList] = useState([1]);
    const [isReceive, setIsReceive] = useState(true);
    const [status, setStatus] = useState(0);
    const [rerender] = useState(true);
    const unit = props.data.unit;
    const isTo = props.data.status;

    const maxItemsInOnePage = 5;
    let cnt = orderList.length;
    let numOfPages = Math.ceil(cnt / maxItemsInOnePage);
    const [pageNum, setPageNum] = useState(1);
    const [pages, setPages] = useState([]);
    
    const updatePages = () => {
        let tmpPages = [];
        for(let i = 0; i < numOfPages; i++) {
            tmpPages.push(i);
        }
        setPages(tmpPages);
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

    const getAllOrders = async() => {
        try {
            await axios
            .get("http://localhost:8080/transTeller/getToCustomerOrder",
            {
                params: {
                    unit: unit,
                }
            })
            .then((res) => {
                console.log(res.data);
            })
        } catch (error) {
            console.log(error);
        }
    }

    const updateOrderList = async() => {
        if(status) {
            let tmpOrderList = [];
            for(let i = 0; i < allOrdersList.length; i++) {
                if(allOrdersList[i].deliver_status === 1) {
                    tmpOrderList.push(allOrdersList[i]);
                }
            }
            cnt = tmpOrderList.length;
            numOfPages = Math.ceil(cnt / maxItemsInOnePage);
            updatePages();
            setOrderList(tmpOrderList);
        }
        else {
            let tmpOrderList = [];
            for(let i = 0; i < allOrdersList.length; i++) {
                if(allOrdersList[i].deliver_status === 0) {
                    tmpOrderList.push(allOrdersList[i]);
                }
            }
            cnt = tmpOrderList.length;
            numOfPages = Math.ceil(cnt / maxItemsInOnePage);
            updatePages();
            setOrderList(tmpOrderList);
        }
        
        console.log(orderList);
    };

    useEffect(() => {
        updateOrderList();
    }, [rerender]);

    useEffect(() => {
        getAllOrders();
        updateOrderList();
        console.log(orderList);
    }, [status, isReceive]);

    return (
        <Fragment>
            <div className={clsx(style.orderListContainer)}>
                

                <div className={clsx(style.content,)}>
                    <div className={clsx(style.functionContainer)}>

                        <div className={clsx(style.statusNav)}>
                        <div className={clsx(style.confirmStatus, {[style.statusNavActive] : status === 0})}
                            onClick={() => {
                                setStatus(0);
                                updateOrderList();
                            }}
                            >Comfirmation</div>
                            <div className={clsx(style.inInventoryStatus, {[style.statusNavActive] : status === 1})}
                            onClick={() => {
                                setStatus(1);
                                updateOrderList();
                            }}
                            >In inventory</div>
                            <div className={clsx(style.shippingStatus, {[style.statusNavActive] : status === 2})}
                            onClick={() => {
                                setStatus(2);
                                updateOrderList();
                            }}
                            >Shipping</div>
                        </div>
                    </div>

                    <div className={clsx(style.orderList)}>
                        {
                            orderList.map((order, index) => {
                                let orderData = {
                                    sender_name: order.customer_name,
                                    sender_phone: order.custom_phone,
                                    receiver_name: order.receiver_name,
                                    receiver_phone: order.receiver_phone,
                                    receiver_address: order.receiver_address,
                                    order_weight: order.weight,
                                    order_price: order.price,
                                    order_date: order.date,
                                };
                                if(index >= (pageNum-1) * maxItemsInOnePage 
                                && index < (pageNum * maxItemsInOnePage))
                                return(
                                    <div className={clsx(style.orderContainer)} key={index}>
                                        <Order data = {orderData} />
                                    </div>
                                );
                            })
                        }
                    </div>

                    <div className={clsx(style.choosePageContainer)}>
                        {
                            pages.map((page, index) => {
                                if(index == 0 || index == numOfPages - 1
                                || (index >= (pageNum - 2) && index <= pageNum )) {
                                    if(index == pageNum -2 && pageNum > 3) {
                                        return (
                                            <Fragment key={index}>
                                                <span>. . .</span>
                                                <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} onClick={
                                                    ()=>{
                                                        setPageNum(index + 1)
                                                    }
                                                }>{index + 1}</button>
                                            </Fragment>
                                        );
                                    }
                                    else if (index == pageNum && pageNum < numOfPages - 2) {
                                        return (
                                            <Fragment key={index}>
                                                <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} onClick={
                                                    ()=>{
                                                        setPageNum(index + 1)
                                                    }
                                                }>{index + 1}</button>
                                                <span>. . .</span>
                                            </Fragment>
                                        );
                                    }
                                    else 
                                    return(
                                        <button className= {clsx(style.pageBtn, {[style.pageBtnActive] : index == pageNum -1})} key={index} onClick={
                                            ()=>{
                                                setPageNum(index + 1)
                                            }
                                        }>{index + 1}</button>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default OrderList;