package com.orion.newsdaily.auditTrail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditTrailRepo extends JpaRepository<AuditTrail,Long>
{
    @Query(value = "SELECT * FROM audit_trails WHERE fk_user_id = ?1 ORDER BY created_at DESC LIMIT 2", nativeQuery = true)
    List<AuditTrail> findLatest2ByUserId(Long id);

}
