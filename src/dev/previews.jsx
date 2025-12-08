import { ComponentPreview, Previews } from "@react-buddy/ide-toolbox";
import { PaletteTree } from "./palette";

const ComponentPreviews = () => {
  return (
    <Previews palette={<PaletteTree />}>
      <ComponentPreview path="/MaterialUIControllerProvider">
        <MaterialUIControllerProvider />
      </ComponentPreview>
    </Previews>
  );
};

export default ComponentPreviews;
