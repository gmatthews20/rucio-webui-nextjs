import "reflect-metadata"
import { NextApiRequest, NextApiResponse } from "next"
import { withSessionRoute } from "@/lib/infrastructure/auth/session-utils"
import { LoginViewModel } from "@/lib/infrastructure/data/view-model/login"
import { MultiVOViewModel } from "@/lib/infrastructure/data/view-model/multi-vo"
import appContainer from "@/lib/infrastructure/config/ioc/container-config"
import { IMultiVOController } from "@/lib/infrastructure/controller/multi-vo-controller"
import CONTROLLERS from "@/lib/infrastructure/config/ioc/ioc-symbols-controllers"
import MultiVOPresenter from "@/lib/infrastructure/presenter/multi-vo-presenter"

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const sessionExists = req.session !== undefined
    const isLoggedIn = sessionExists && req.session.user !== undefined && req.session.user.isLoggedIn

    const MultiVOController = appContainer.get<IMultiVOController>(CONTROLLERS.MULTIVO)
    const MultiVO = await MultiVOController.handle({name: 'default', shortName: 'def'}, res)

    if (req.method === 'GET') {
        // If user is logged in, redirect to callbackUrl
        if (isLoggedIn) {
            const callbackUrl = req.query.callbackUrl as string | undefined
            if (callbackUrl) {
                res.redirect(callbackUrl)
            } else {
                res.redirect("/dashboard")
            }
            return
        }
        // If user is not logged in, callbackUrl = provided callbackUrl or home page, then redirect to login page
        const callbackUrl = req.query.callbackUrl as string | '/dashboard'
        res.redirect(`/auth/login?callbackUrl=${callbackUrl}`)
    }
    else if (req.method === 'POST') {
        const viewModel: LoginViewModel = {
            x509Enabled: false,
            oidcEnabled: false,
            oidcProviders: [],
            isLoggedIn: isLoggedIn,
            ...MultiVOController.useCase.presenter.response
        }
        res.status(200).json(viewModel)
    }
    else {
        res.status(405).json({ error: 'Method not allowed' })
    }
}

export default withSessionRoute(loginRoute)