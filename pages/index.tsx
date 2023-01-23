import type { NextPage } from "next";
import Plain from "../src/components/Plain";
import PlainConfigs from "../src/components/PlainConfigs";
import PlainDrawer from "../src/components/PlainDrawer";
import { MathFunctionProvider } from "../src/context/mathFunctionContext";
import { PlainProvider } from "../src/context/plainContext";

const Home: NextPage = () => {
	return (
		<>
			<MathFunctionProvider>
				<PlainProvider>
					<PlainDrawer />
					<PlainConfigs />
					<Plain />
				</PlainProvider>
			</MathFunctionProvider>
		</>
	);
};

export default Home;
