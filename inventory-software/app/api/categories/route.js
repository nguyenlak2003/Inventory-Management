import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const {title, descriptions} = await request.json()    

        const category = {title, descriptions}
        return NextResponse.json(category)
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            error,
            message: "Failed to create category"
        }, {
            status: 500
        })
    }
}