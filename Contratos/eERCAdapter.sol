
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CVNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract eERCAdapter is Ownable {
    CVNFT public cvnft;
    address public empresa;

    event NFTMinted(address indexed candidato, address indexed evaluador, string uri);
    event NFTMintedWithCelestia(
        address indexed candidato,
        address indexed evaluador,
        string uri,
        bytes10 subID,
        uint64  height,
        bytes32 commitment
    );

    constructor(address _cvnft, address _empresa) Ownable(msg.sender) {
        cvnft = CVNFT(_cvnft);
        empresa = _empresa;
    }

    modifier onlyEmpresa() {
        require(msg.sender == empresa, "Solo la empresa puede mintear");
        _;
    }

    // (compat) mint simple
    function mintCV(address candidato, string memory metadataURI) external onlyEmpresa {
        cvnft.mint(candidato, metadataURI);
        emit NFTMinted(candidato, msg.sender, metadataURI);
    }

    // recomendado: mint + Celestia en una tx
    function mintCVWithCelestia(
        address candidato,
        string memory metadataURI,
        bytes10 subID,
        uint64  height,
        bytes32 commitment
    ) external onlyEmpresa {
        cvnft.mintWithCelestia(candidato, metadataURI, subID, height, commitment);
        emit NFTMintedWithCelestia(candidato, msg.sender, metadataURI, subID, height, commitment);
    }
}
