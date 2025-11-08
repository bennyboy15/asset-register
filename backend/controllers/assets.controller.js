import Asset from "../models/asset.model.js";

export async function getAssets(req, res) {
    try {
        const assets = await Asset.find();
        return res.status(200).json(assets);
    } catch (error) {
        console.log("Error in getAssets @ assets controller");
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function getSpecificAsset(req, res) {
    try {
        const { id } = req.params;
        const asset = await Asset.findById(id);
        if (!asset) return res.status(400).json({ message: "No asset found" });
        return res.status(200).json(asset);
    } catch (error) {
        console.log("Error in getSpecificAsset @ assets controller");
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export async function createAsset(req, res) {
    try {
        const { name, lastService, nextService } = req.body;

        if (!name || !nextService) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const asset = new Asset({ name, lastService, nextService });
        await asset.save();

        return res.status(201).json(asset);
    } catch (error) {
        console.log("Error in createAsset @ assets controller");
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function updateAsset(req, res) {
    try {
        const { id } = req.params;
        const { name, assetImage, lastService, nextService } = req.body;

        const updatedAsset = await Asset.findByIdAndUpdate(
            id,
            { name, assetImage, lastService, nextService },
            { new: true, runValidators: true }
        );

        if (!updatedAsset) {
            return res.status(404).json({ message: "Asset not found" });
        }

        return res.status(200).json(updatedAsset);
    } catch (error) {
        console.log("Error in updateAsset @ assets controller");
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export async function deleteAsset(req, res) {
    try {
        const { id } = req.params;
        await Asset.findByIdAndDelete(id);
        return res.status(201).json({ message: "Successfully deleted asset" });
    } catch (error) {
        console.log("Error in deleteAsset @ assets controller");
        return res.status(500).json({ message: "Internal Server Error" });
    }
};