import Orders from "../../model/Orders.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalOrders = await Orders.countDocuments();

        const pendingOrders = await Orders.countDocuments({
            status: "Paid",
            orderState: "Processing"
        });

        const deliveredOrders = await Orders.countDocuments({
            orderState: "completed"
        });

        const revenueResult = await Orders.aggregate([
            {
                $match: {
                    status: "Paid"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalRevenue
            }
        });

    } catch (error) {
        console.error("Admin Stats Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard statistics"
        });
    }
};