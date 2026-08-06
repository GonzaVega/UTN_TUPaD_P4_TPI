package com.gvega.utn.tupad.trabajos_practicos_p_4.repository;

import com.gvega.utn.tupad.trabajos_practicos_p_4.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
