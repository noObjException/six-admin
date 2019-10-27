import React, { FC } from 'react'
import { Route, RouteComponentProps } from 'react-router-dom'
import { StaticContext } from 'react-router'
import FormTool from 'pages/tools/form'
import TForm from 'pages/test'
import TableTool from 'pages/tools/table'


interface IRoute {
	path: string,
	name?: string,
	exact?: boolean,
	component?: React.ComponentClass<any, any> | React.FunctionComponent<any> | React.ComponentClass<RouteComponentProps<any, StaticContext, any>, any> | React.FunctionComponent<RouteComponentProps<any, StaticContext, any>> | undefined,
}

const routes: IRoute[] = [
	{ path: '/tools/form', component: FormTool },
	{ path: '/tools/table', component: TableTool },
	{ path: '/test', component: TForm },
]

const Routes: FC = () => {
	return (
		<>
			{routes.map(({ path, exact = true, component }, key) => (
				<Route path={path} exact={exact} component={component} key={key} />
			))}
		</>
	)
}

export default Routes
